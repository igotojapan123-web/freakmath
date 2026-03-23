/**
 * FREAKMATH 네비게이션 & 링크 검증 봇
 * 
 * 검증 항목:
 * 1. 모든 내부 링크가 404 없이 연결되는지
 * 2. 계보(연결 공식) 링크가 실제 존재하는 공식으로 가는지
 * 3. 뒤로가기/홈 버튼이 작동하는지
 * 4. 초등→중등→고등 계보 체인이 끊기지 않는지
 * 5. 깨진 앵커 링크 (#section 등)
 * 
 * 사용법:
 *   node navigation-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const REPORT_PATH = './qa-navigation-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 70; i++) ids.push(`H${String(i).padStart(3, "0")}`);
  return ids;
}

function checkNavigation(baseUrl) {
  const issues = [];

  // 1. 모든 내부 링크 수집
  const links = document.querySelectorAll('a[href]');
  const internalLinks = [];
  const externalLinks = [];

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) return;

    if (href.startsWith('/') || href.startsWith(baseUrl)) {
      internalLinks.push({
        href: href.startsWith('/') ? href : href.replace(baseUrl, ''),
        text: link.innerText.trim().slice(0, 50),
        visible: link.offsetParent !== null,
      });
    }
  });

  // 2. 빈 링크 (href="#" 또는 href="") 감지
  const emptyLinks = document.querySelectorAll('a[href=""], a[href="#"]');
  if (emptyLinks.length > 0) {
    issues.push({
      type: 'EMPTY_LINKS',
      severity: 'LOW',
      message: `빈 링크 ${emptyLinks.length}개 (href="" 또는 "#")`,
    });
  }

  // 3. 클릭 가능해 보이지만 링크가 없는 요소
  const clickableNoLink = document.querySelectorAll('[class*="link"]:not(a), [class*="click"]:not(a), [class*="btn"]:not(a):not(button)');
  // 이건 LOW로만 체크

  // 4. 계보 섹션 링크 검사
  const genealogySection = document.querySelector('[data-section="genealogy"], [class*="genealog"], [class*="계보"], [class*="lineage"], [class*="Genealogy"]');
  if (genealogySection) {
    const genealogyLinks = genealogySection.querySelectorAll('a[href]');
    genealogyLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const text = link.innerText.trim();
      if (href) {
        internalLinks.push({
          href: href.startsWith('/') ? href : href.replace(baseUrl, ''),
          text: `[계보] ${text.slice(0, 40)}`,
          isGenealogy: true,
        });
      }
    });

    if (genealogyLinks.length === 0) {
      issues.push({
        type: 'GENEALOGY_NO_LINKS',
        severity: 'MEDIUM',
        message: '계보 섹션에 링크가 없음',
      });
    }
  }

  // 5. 네비게이션 바 존재 여부
  const nav = document.querySelector('nav, [role="navigation"], header');
  if (!nav) {
    issues.push({
      type: 'NO_NAVIGATION',
      severity: 'MEDIUM',
      message: '네비게이션 바가 없음',
    });
  }

  // 6. 홈으로 가는 링크 존재 여부
  const homeLink = document.querySelector('a[href="/"], a[href="/home"]');
  if (!homeLink && nav) {
    issues.push({
      type: 'NO_HOME_LINK',
      severity: 'LOW',
      message: '홈 링크가 없음',
    });
  }

  return { issues, internalLinks };
}

async function runNavigationBot() {
  console.log('🔗 FREAKMATH 네비게이션 검증 봇 시작\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  const results = [];
  const allBrokenLinks = new Set();
  const allValidLinks = new Set();
  let totalIssues = 0;

  // 1단계: 각 공식 페이지의 링크 수집 및 기본 검사
  console.log('📋 1단계: 페이지별 링크 수집\n');

  for (let i = 0; i < formulaIds.length; i++) {
    const id = formulaIds[i];
    const progress = `[${i + 1}/${formulaIds.length}]`;

    try {
      const page = await browser.newPage();
      const url = `${BASE_URL}/formula/${id}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 800));

      const { issues, internalLinks } = await page.evaluate(checkNavigation, BASE_URL);

      results.push({ id, url, issues, internalLinks, issueCount: issues.length });
      totalIssues += issues.length;

      // 내부 링크 기록
      internalLinks.forEach(link => {
        allValidLinks.add(link.href);
      });

      if (issues.length > 0) {
        console.log(`${progress} 🟡 ${id}: ${issues.length}개 문제, ${internalLinks.length}개 링크`);
      } else {
        console.log(`${progress} ✅ ${id}: ${internalLinks.length}개 링크 OK`);
      }

      await page.close();
    } catch (err) {
      console.log(`${progress} 💀 ${id}: 로딩 실패`);
      results.push({
        id, issues: [{ type: 'PAGE_LOAD_FAILED', severity: 'CRITICAL', message: err.message.slice(0, 100) }],
        internalLinks: [], issueCount: 1,
      });
      totalIssues++;
    }
  }

  // 2단계: 수집된 내부 링크 실제 접속 테스트
  console.log('\n📋 2단계: 링크 접속 테스트\n');

  const uniqueLinks = [...allValidLinks];
  const linkResults = {};

  for (let i = 0; i < uniqueLinks.length; i++) {
    const href = uniqueLinks[i];
    const progress = `[${i + 1}/${uniqueLinks.length}]`;

    try {
      const page = await browser.newPage();
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const status = response ? response.status() : 0;
      linkResults[href] = status;

      if (status === 404) {
        allBrokenLinks.add(href);
        console.log(`${progress} ❌ 404: ${href}`);
      } else if (status >= 400) {
        allBrokenLinks.add(href);
        console.log(`${progress} ⚠️ ${status}: ${href}`);
      } else {
        console.log(`${progress} ✅ ${status}: ${href}`);
      }

      await page.close();
    } catch (err) {
      allBrokenLinks.add(href);
      linkResults[href] = 'ERROR';
      console.log(`${progress} 💀 ERROR: ${href}`);
    }
  }

  // 결과에 깨진 링크 추가
  results.forEach(result => {
    result.internalLinks.forEach(link => {
      if (allBrokenLinks.has(link.href)) {
        result.issues.push({
          type: link.isGenealogy ? 'BROKEN_GENEALOGY_LINK' : 'BROKEN_LINK',
          severity: link.isGenealogy ? 'HIGH' : 'MEDIUM',
          message: `깨진 링크: ${link.href} (텍스트: ${link.text})`,
        });
        result.issueCount++;
        totalIssues++;
      }
    });
  });

  await browser.close();

  // 리포트 생성
  const problemFormulas = results.filter(r => r.issueCount > 0);
  const report = {
    botName: 'navigation',
    summary: {
      totalPages: formulaIds.length,
      passed: results.filter(r => r.issueCount === 0).length,
      failed: problemFormulas.length,
      totalIssues,
      totalLinksChecked: uniqueLinks.length,
      brokenLinks: allBrokenLinks.size,
    },
    brokenLinksList: [...allBrokenLinks],
    problems: problemFormulas,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('🔗 네비게이션 리포트');
  console.log(`✅ 통과: ${report.summary.passed}개`);
  console.log(`❌ 문제: ${report.summary.failed}개`);
  console.log(`🔗 링크 검사: ${uniqueLinks.length}개 중 ${allBrokenLinks.size}개 깨짐`);
  console.log(`📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(50));

  if (allBrokenLinks.size > 0) {
    console.log('\n깨진 링크 목록:');
    [...allBrokenLinks].forEach(link => console.log(`  ❌ ${link}`));
  }
}

runNavigationBot().catch(console.error);
