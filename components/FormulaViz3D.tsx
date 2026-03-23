'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VIO = 0x534AB7
const GRN = 0x1D9E75
const ORG = 0xD85A30
const WHT = 0xffffff
const BG = 0x05080f

interface Props {
  visualType: string
  values?: Record<string, number>
  height?: number
}

export default function FormulaViz3D({ visualType, values = {}, height = 240 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    cleanupRef.current?.()

    const W = el.clientWidth || 800, H = height
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG)

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    camera.position.set(4, 3, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    el.innerHTML = ''
    el.appendChild(renderer.domElement)

    // 조명
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 8, 5)
    dirLight.castShadow = true
    scene.add(dirLight)

    // 바닥 그리드
    const grid = new THREE.GridHelper(10, 20, 0x1a1a2e, 0x1a1a2e)
    grid.position.y = -0.01
    scene.add(grid)

    let frameId = 0
    let t = 0
    const loopLen = 540 // 9초 애니메이션 + 3초 대기
    const objs: THREE.Object3D[] = []

    // 텍스트 스프라이트 헬퍼
    const makeLabel = (text: string, color: string, size = 0.4): THREE.Sprite => {
      const canvas = document.createElement('canvas')
      canvas.width = 512; canvas.height = 128
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = color
      ctx.font = 'bold 48px sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, 256, 64)
      const tex = new THREE.CanvasTexture(canvas)
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(size * 4, size, 1)
      return sprite
    }

    const addBox = (x: number, y: number, z: number, w: number, h: number, d: number, color: number, opacity = 0.7) => {
      const geo = new THREE.BoxGeometry(w, h, d)
      const mat = new THREE.MeshPhongMaterial({ color, transparent: true, opacity })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      scene.add(mesh); objs.push(mesh)
      return mesh
    }

    // 시각화 빌드
    switch (visualType) {

      case 'poly_add': {
        // H001: 블록탑 합치기
        // 2x²+3x 탑 (보라)
        const b1 = addBox(-2, 0.5, 0, 0.8, 1, 0.8, VIO); b1.visible = false
        const b2 = addBox(-2, 1.5, 0, 0.8, 1, 0.8, VIO); b2.visible = false
        const b3 = addBox(-2, 0.5, 1.2, 0.6, 1, 0.6, VIO, 0.5); b3.visible = false
        // x²-x 탑 (초록)
        const g1 = addBox(2, 0.5, 0, 0.8, 1, 0.8, GRN); g1.visible = false
        const g2 = addBox(2, 0.5, 1.2, 0.6, 1, 0.6, GRN, 0.5); g2.visible = false
        // 라벨
        const l1 = makeLabel('2x²+3x', '#534AB7'); l1.position.set(-2, 3, 0); scene.add(l1); l1.visible = false
        const l2 = makeLabel('x²-x', '#1D9E75'); l2.position.set(2, 2.5, 0); scene.add(l2); l2.visible = false
        const l3 = makeLabel('= 3x²+2x', '#D85A30'); l3.position.set(0, 3.5, 0); scene.add(l3); l3.visible = false
        objs.push(l1, l2, l3)

        const animate = () => {
          const loopT = t % loopLen
          const p = Math.min(1, loopT / 360)
          b1.visible = p > 0.05; b2.visible = p > 0.1; b3.visible = p > 0.15
          g1.visible = p > 0.2; g2.visible = p > 0.25
          l1.visible = p > 0.15; l2.visible = p > 0.25; l3.visible = p > 0.7
          // 합치기 애니메이션
          if (p > 0.5) {
            const mp = Math.min(1, (p - 0.5) * 4)
            g1.position.x = 2 + (0 - 2) * mp
            g1.position.y = 0.5 + (2.5 - 0.5) * mp
          }
        }
        scene.userData.animate = animate
        break
      }

      case 'poly_mul_h': {
        // H002: 넓이 모델 4칸 블록
        const parts = [
          { x: -1, z: -1, w: 1.5, d: 1.5, c: VIO, l: 'ac' },
          { x: 0.8, z: -1, w: 1, d: 1.5, c: GRN, l: 'ad' },
          { x: -1, z: 0.8, w: 1.5, d: 1, c: GRN, l: 'bc' },
          { x: 0.8, z: 0.8, w: 1, d: 1, c: ORG, l: 'bd' },
        ]
        parts.forEach((pp, i) => {
          const mesh = addBox(pp.x, 0, pp.z, pp.w, 0.01, pp.d, pp.c, 0)
          const label = makeLabel(pp.l, i === 0 ? '#534AB7' : i === 3 ? '#D85A30' : '#1D9E75', 0.3)
          label.position.set(pp.x, 0.8, pp.z); scene.add(label); label.visible = false
          objs.push(label)
          mesh.userData = { targetH: 0.8, label, idx: i }
        })
        const lResult = makeLabel('(a+b)(c+d) = ac+ad+bc+bd', '#1D9E75'); lResult.position.set(0, 2.5, 0); scene.add(lResult); lResult.visible = false; objs.push(lResult)

        scene.userData.animate = () => {
          const loopT = t % loopLen; const p = Math.min(1, loopT / 360)
          objs.forEach(o => { if (o.userData?.targetH !== undefined) {
            const i = o.userData.idx; const sp = Math.max(0, Math.min(1, (p - i * 0.15) * 4))
            ;(o as THREE.Mesh).scale.y = sp * 100 + 0.01
            ;(o as THREE.Mesh).position.y = sp * o.userData.targetH / 2
            const mat = (o as THREE.Mesh).material as THREE.MeshPhongMaterial
            mat.opacity = sp * 0.7
            if (o.userData.label) o.userData.label.visible = sp > 0.5
          }})
          lResult.visible = p > 0.8
        }
        break
      }

      case 'expand_formula': {
        // H003: (a+b)² 정사각형 분할
        const a = 2, b = 1.2
        addBox(-b/2, 0.4, -b/2, a, 0.8, a, VIO, 0.5)
        addBox(a/2+0.1, 0.4, -b/2, b, 0.8, a, ORG, 0.4)
        addBox(-b/2, 0.4, a/2+0.1, a, 0.8, b, ORG, 0.4)
        addBox(a/2+0.1, 0.4, a/2+0.1, b, 0.8, b, GRN, 0.5)
        const labels = [
          makeLabel('a²', '#534AB7'), makeLabel('ab', '#D85A30'),
          makeLabel('ab', '#D85A30'), makeLabel('b²', '#1D9E75'),
        ]
        labels[0].position.set(-b/2, 1.2, -b/2); labels[1].position.set(a/2+0.1, 1.2, -b/2)
        labels[2].position.set(-b/2, 1.2, a/2+0.1); labels[3].position.set(a/2+0.1, 1.2, a/2+0.1)
        labels.forEach(l => { scene.add(l); objs.push(l) })
        const result = makeLabel('(a+b)² = a²+2ab+b²', '#1D9E75'); result.position.set(0.5, 2.5, 0.5); scene.add(result); objs.push(result)
        scene.userData.animate = () => { const p = Math.min(1, (t % loopLen) / 360); result.visible = p > 0.7 }
        break
      }

      case 'factor_h': {
        // H004: 인수분해 — 분리→합체
        addBox(0, 0.4, 0, 3, 0.8, 3, VIO, 0.3)
        const result = makeLabel('a²+2ab+b² → (a+b)²', '#1D9E75'); result.position.set(0, 2.5, 0); scene.add(result); objs.push(result)
        scene.userData.animate = () => { result.visible = Math.min(1, (t % loopLen) / 360) > 0.6 }
        break
      }

      case 'remainder_theorem': {
        // H005: f(x) 곡선 + x=a 수직면
        const curve = new THREE.BufferGeometry()
        const pts: THREE.Vector3[] = []
        for (let x = -3; x <= 3; x += 0.1) pts.push(new THREE.Vector3(x, x * x * 0.3 - 0.5, 0))
        curve.setFromPoints(pts)
        const line = new THREE.Line(curve, new THREE.LineBasicMaterial({ color: VIO, linewidth: 2 }))
        scene.add(line); objs.push(line)
        // x=1 수직면
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 4, 1, 1), new THREE.MeshPhongMaterial({ color: ORG, transparent: true, opacity: 0.3 }))
        plane.position.set(1, 1, 0); scene.add(plane); objs.push(plane)
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({ color: GRN }))
        dot.position.set(1, 1 * 0.3 - 0.5, 0); scene.add(dot); objs.push(dot)
        const label = makeLabel('f(a) = 나머지', '#1D9E75'); label.position.set(1, 2.5, 0); scene.add(label); objs.push(label)
        scene.userData.animate = () => { label.visible = Math.min(1, (t % loopLen) / 360) > 0.5 }
        break
      }

      case 'factor_theorem': {
        // H006: f(x) x축 교점
        const curve2 = new THREE.BufferGeometry()
        const pts2: THREE.Vector3[] = []
        for (let x = -2; x <= 4; x += 0.1) pts2.push(new THREE.Vector3(x, (x - 1) * (x - 3) * 0.3, 0))
        curve2.setFromPoints(pts2)
        scene.add(new THREE.Line(curve2, new THREE.LineBasicMaterial({ color: VIO })));
        const d1 = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({ color: ORG }))
        d1.position.set(1, 0, 0); scene.add(d1)
        const d2 = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({ color: ORG }))
        d2.position.set(3, 0, 0); scene.add(d2)
        const label2 = makeLabel('f(a)=0 → (x-a)는 인수', '#1D9E75'); label2.position.set(2, 2.5, 0); scene.add(label2)
        scene.userData.animate = () => { label2.visible = Math.min(1, (t % loopLen) / 360) > 0.5 }
        break
      }

      case 'complex_number': {
        // H007: 복소평면
        // 실수축, 허수축
        const axisX = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0), new THREE.Vector3(3,0,0)]), new THREE.LineBasicMaterial({color:0x444466}))
        const axisY = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-3,0), new THREE.Vector3(0,3,0)]), new THREE.LineBasicMaterial({color:0x444466}))
        scene.add(axisX); scene.add(axisY)
        const pt = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshPhongMaterial({color:VIO}))
        pt.position.set(2, 3, 0); scene.add(pt)
        // 화살표
        const arrowR = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(2,0,0)]), new THREE.LineBasicMaterial({color:GRN}))
        const arrowI = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2,0,0),new THREE.Vector3(2,3,0)]), new THREE.LineBasicMaterial({color:ORG}))
        scene.add(arrowR); scene.add(arrowI)
        const lb = makeLabel('2+3i', '#534AB7'); lb.position.set(2, 3.5, 0); scene.add(lb)
        const lbR = makeLabel('실수부=2', '#1D9E75', 0.25); lbR.position.set(1, -0.5, 0); scene.add(lbR)
        const lbI = makeLabel('허수부=3', '#D85A30', 0.25); lbI.position.set(2.8, 1.5, 0); scene.add(lbI)
        camera.position.set(0, 0, 8)
        scene.userData.animate = () => {}
        break
      }

      case 'discriminant': {
        // H008: 판별식 — D>0, D=0, D<0 순환
        const curves = [
          { a: 1, b: -2, c: -3, label: 'D>0: 실근 2개', color: VIO },
          { a: 1, b: -4, c: 4, label: 'D=0: 중근', color: GRN },
          { a: 1, b: 0, c: 2, label: 'D<0: 허근', color: ORG },
        ]
        const curveMeshes: THREE.Line[] = []
        const curveLabels: THREE.Sprite[] = []
        curves.forEach((cv, ci) => {
          const geo = new THREE.BufferGeometry()
          const p2: THREE.Vector3[] = []
          for (let x = -3; x <= 5; x += 0.1) p2.push(new THREE.Vector3(x, cv.a * x * x + cv.b * x + cv.c, 0))
          geo.setFromPoints(p2)
          const mesh = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: cv.color }))
          mesh.visible = false; scene.add(mesh); curveMeshes.push(mesh)
          const lb = makeLabel(cv.label, ci === 0 ? '#534AB7' : ci === 1 ? '#1D9E75' : '#D85A30')
          lb.position.set(1, 4, 0); lb.visible = false; scene.add(lb); curveLabels.push(lb)
        })
        // x축
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(6,0,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        camera.position.set(1, 2, 8)
        scene.userData.animate = () => {
          const loopT = t % loopLen; const phase = Math.floor((loopT / loopLen) * 3) % 3
          curveMeshes.forEach((m, i) => { m.visible = i === phase })
          curveLabels.forEach((l, i) => { l.visible = i === phase })
        }
        break
      }

      case 'vieta': {
        // H009: 근과 계수 — 포물선+교점
        const geo = new THREE.BufferGeometry()
        const p3: THREE.Vector3[] = []
        for (let x = -1; x <= 5; x += 0.1) p3.push(new THREE.Vector3(x, (x - 1) * (x - 3), 0))
        geo.setFromPoints(p3)
        scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: VIO })))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(6,0,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        const da = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:ORG})); da.position.set(1,0,0); scene.add(da)
        const db = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:ORG})); db.position.set(3,0,0); scene.add(db)
        const l1 = makeLabel('α=1', '#D85A30', 0.25); l1.position.set(1,-0.8,0); scene.add(l1)
        const l2 = makeLabel('β=3', '#D85A30', 0.25); l2.position.set(3,-0.8,0); scene.add(l2)
        const lr = makeLabel('α+β=4=-b/a, αβ=3=c/a', '#1D9E75'); lr.position.set(2,4,0); scene.add(lr)
        camera.position.set(2,2,8)
        scene.userData.animate = () => { lr.visible = Math.min(1,(t%loopLen)/360) > 0.5 }
        break
      }

      case 'quad_func_eq': {
        // H010: 포물선과 y=0 평면
        const geo = new THREE.BufferGeometry()
        const p4: THREE.Vector3[] = []
        for (let x = -2; x <= 4; x += 0.1) p4.push(new THREE.Vector3(x, (x-1)*(x-3), 0))
        geo.setFromPoints(p4)
        scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({color:VIO})))
        // y=0 평면
        const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(8,0.05), new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.3}))
        floorPlane.rotation.x = -Math.PI/2; floorPlane.position.y = 0; scene.add(floorPlane)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(5,0,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        const d1b = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:ORG})); d1b.position.set(1,0,0); scene.add(d1b)
        const d2b = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:ORG})); d2b.position.set(3,0,0); scene.add(d2b)
        const lf = makeLabel('포물선 ∩ x축 = 근', '#1D9E75'); lf.position.set(2,4,0); scene.add(lf)
        camera.position.set(1,3,8)
        scene.userData.animate = () => { lf.visible = Math.min(1,(t%loopLen)/360) > 0.5 }
        break
      }

      case 'abs_function': {
        // H011: y=|x| V자 그래프
        const pts11: THREE.Vector3[] = []
        for (let x = -3; x <= 3; x += 0.1) pts11.push(new THREE.Vector3(x, Math.abs(x), 0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts11), new THREE.LineBasicMaterial({color:VIO, linewidth:2})))
        // y=|x-2|+1 이동
        const pts11b: THREE.Vector3[] = []
        for (let x = -1; x <= 5; x += 0.1) pts11b.push(new THREE.Vector3(x, Math.abs(x-2)+1, 0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts11b), new THREE.LineBasicMaterial({color:GRN})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(6,0,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1,0),new THREE.Vector3(0,5,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        const d11 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshPhongMaterial({color:ORG})); d11.position.set(0,0,0); scene.add(d11)
        const d11b = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshPhongMaterial({color:ORG})); d11b.position.set(2,1,0); scene.add(d11b)
        const l11 = makeLabel('y=|x|', '#534AB7', 0.25); l11.position.set(-2,3,0); scene.add(l11)
        const l11b = makeLabel('y=|x-2|+1', '#1D9E75', 0.25); l11b.position.set(4,3,0); scene.add(l11b)
        const l11r = makeLabel('음수 부분이 접혀 올라간다', '#D85A30'); l11r.position.set(1,4.5,0); scene.add(l11r)
        camera.position.set(1,2,8); scene.userData.animate = () => { l11r.visible = Math.min(1,(t%loopLen)/360)>0.6 }
        break
      }

      case 'sigma_notation': {
        // H012: Σ 막대 솟아오름
        const n12 = 6
        for (let i = 0; i < n12; i++) {
          const h12 = (i+1) * 0.5
          const mesh = addBox(-2 + i * 0.8, 0, 0, 0.6, 0.01, 0.6, i%2===0?VIO:GRN, 0)
          mesh.userData = {targetH: h12, idx: i}
        }
        const l12 = makeLabel('Σ = 전부 더하기', '#1D9E75'); l12.position.set(0,4,0); scene.add(l12); l12.visible = false
        scene.userData.animate = () => {
          const p12 = Math.min(1,(t%loopLen)/360)
          objs.forEach(o => { if (o.userData?.targetH) { const i=o.userData.idx; const sp=Math.max(0,Math.min(1,(p12-i*0.08)*3))
            ;(o as THREE.Mesh).scale.y = Math.max(0.01, sp * o.userData.targetH * 100)
            ;(o as THREE.Mesh).position.y = sp * o.userData.targetH / 2
            const mat=(o as THREE.Mesh).material as THREE.MeshPhongMaterial; mat.opacity = sp*0.7 }})
          l12.visible = p12 > 0.7
        }
        break
      }

      case 'quad_inequality': {
        // H013: 포물선 + y>0/y<0 영역
        const pts13: THREE.Vector3[] = []
        for (let x=-3;x<=5;x+=0.1) pts13.push(new THREE.Vector3(x,(x-1)*(x-3),0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts13), new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(6,0,0)]), new THREE.LineBasicMaterial({color:0x333355})))
        // y>0 영역 (보라 반투명 막대)
        for (let x=-2;x<=0.8;x+=0.4) { const y13=(x-1)*(x-3); if(y13>0) addBox(x,y13/2,0,0.3,y13,0.3,VIO,0.2) }
        for (let x=3.2;x<=5;x+=0.4) { const y13=(x-1)*(x-3); if(y13>0) addBox(x,y13/2,0,0.3,y13,0.3,VIO,0.2) }
        // y<0 영역 (주황)
        for (let x=1.2;x<=2.8;x+=0.3) { const y13=(x-1)*(x-3); if(y13<0) addBox(x,y13/2,0,0.3,-y13,0.3,ORG,0.2) }
        const d13a = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:GRN})); d13a.position.set(1,0,0); scene.add(d13a)
        const d13b = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:GRN})); d13b.position.set(3,0,0); scene.add(d13b)
        const l13 = makeLabel('x<1 또는 x>3 → y>0', '#534AB7'); l13.position.set(1,4,0); scene.add(l13)
        camera.position.set(1,3,8); scene.userData.animate = () => { l13.visible = Math.min(1,(t%loopLen)/360)>0.5 }
        break
      }

      case 'abs_inequality': {
        // H014: |x-a|<b 수직선
        const a14=2, b14=3
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(8,0,0)]), new THREE.LineBasicMaterial({color:0x444466})))
        // 중심점 a
        const da14 = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color:ORG})); da14.position.set(a14,0,0); scene.add(da14)
        // 범위 [a-b, a+b]
        const range14 = new THREE.Mesh(new THREE.BoxGeometry(b14*2, 0.3, 0.3), new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.4}))
        range14.position.set(a14,0.3,0); scene.add(range14)
        const dl = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshPhongMaterial({color:GRN})); dl.position.set(a14-b14,0,0); scene.add(dl)
        const dr = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshPhongMaterial({color:GRN})); dr.position.set(a14+b14,0,0); scene.add(dr)
        const l14a = makeLabel(`a=${a14}`, '#D85A30', 0.25); l14a.position.set(a14,1,0); scene.add(l14a)
        const l14b = makeLabel(`${a14-b14} < x < ${a14+b14}`, '#534AB7'); l14b.position.set(a14,2,0); scene.add(l14b)
        const l14c = makeLabel('중심에서 거리 < b', '#1D9E75'); l14c.position.set(a14,3,0); scene.add(l14c)
        camera.position.set(2,2,7); scene.userData.animate = () => { l14c.visible = Math.min(1,(t%loopLen)/360)>0.5 }
        break
      }

      case 'counting_h': {
        // H015: 경우의 수 — 3D 트리 분기
        // 합의 법칙: A(3) + B(4) = 7
        for (let i=0;i<3;i++) { const s=new THREE.Mesh(new THREE.SphereGeometry(0.2),new THREE.MeshPhongMaterial({color:VIO})); s.position.set(-1.5+i*0.8,2,0); scene.add(s) }
        for (let i=0;i<4;i++) { const s=new THREE.Mesh(new THREE.SphereGeometry(0.2),new THREE.MeshPhongMaterial({color:GRN})); s.position.set(-1.5+i*0.7,0,0); scene.add(s) }
        const l15a = makeLabel('A: 3가지', '#534AB7', 0.25); l15a.position.set(0,3,0); scene.add(l15a)
        const l15b = makeLabel('B: 4가지', '#1D9E75', 0.25); l15b.position.set(0,-1,0); scene.add(l15b)
        const l15r = makeLabel('합: 3+4=7, 곱: 3×4=12', '#D85A30'); l15r.position.set(0,4.5,0); scene.add(l15r)
        camera.position.set(0,2,7); scene.userData.animate = () => { l15r.visible = Math.min(1,(t%loopLen)/360)>0.6 }
        break
      }

      case 'permutation': {
        // H016: 순열 5P3 — 구슬 줄 세우기
        const colors16 = [VIO,GRN,ORG,0xf87171,0xfbbf24]
        for (let i=0;i<5;i++) { const s=new THREE.Mesh(new THREE.SphereGeometry(0.25),new THREE.MeshPhongMaterial({color:colors16[i]})); s.position.set(-2+i*1,2,0); scene.add(s) }
        // 선택 3개 강조
        for (let i=0;i<3;i++) { const s=new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshPhongMaterial({color:colors16[i],emissive:colors16[i],emissiveIntensity:0.3})); s.position.set(-1+i*1,-1,0); scene.add(s) }
        const l16a = makeLabel('5개 중 3개 줄 세우기', '#534AB7'); l16a.position.set(0,3.5,0); scene.add(l16a)
        const l16b = makeLabel('5×4×3 = 60가지', '#D85A30'); l16b.position.set(0,4.5,0); scene.add(l16b)
        camera.position.set(0,1.5,7); scene.userData.animate = () => { l16b.visible = Math.min(1,(t%loopLen)/360)>0.5 }
        break
      }

      case 'combination': {
        // H017: 조합 5C3 — 순서 무시
        const l17a = makeLabel('순열 60가지', '#534AB7'); l17a.position.set(0,3.5,0); scene.add(l17a)
        // 6개씩 묶음
        for (let g=0;g<10;g++) { const row=Math.floor(g/5),col=g%5
          addBox(-2+col*1, 0.3, -1+row*2, 0.8, 0.6, 0.8, g<3?VIO:g<6?GRN:ORG, 0.4) }
        const l17b = makeLabel('같은 조합 6개씩 → ÷6', '#1D9E75'); l17b.position.set(0,2,0); scene.add(l17b)
        const l17c = makeLabel('5C3 = 60÷6 = 10', '#D85A30'); l17c.position.set(0,4.5,0); scene.add(l17c)
        camera.position.set(0,3,7); scene.userData.animate = () => { l17c.visible = Math.min(1,(t%loopLen)/360)>0.6 }
        break
      }

      case 'binomial_theorem': {
        // H018: 파스칼 삼각형 3D
        const pascal = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
        pascal.forEach((row,r) => { row.forEach((v,c) => {
          const x = -r/2 + c, y = 3-r, z = 0
          const sz = Math.min(0.8, v*0.15+0.2)
          const mesh = addBox(x, y, z, sz, sz, sz, r%2===0?VIO:GRN, 0.5)
          const lb = makeLabel(String(v), '#ffffff', 0.15); lb.position.set(x, y+sz/2+0.3, z); scene.add(lb)
        })})
        const l18 = makeLabel('파스칼 삼각형 → 이항계수', '#D85A30'); l18.position.set(0,4.5,0); scene.add(l18)
        camera.position.set(0,1.5,8); scene.userData.animate = () => { l18.visible = Math.min(1,(t%loopLen)/360)>0.5 }
        break
      }

      case 'set_operation': {
        // H019: 3D 벤 다이어그램 (반투명 구)
        const sA = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15}))
        sA.position.set(-0.7,1,0); scene.add(sA)
        const sB = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.15}))
        sB.position.set(0.7,1,0); scene.add(sB)
        const sAw = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.1,wireframe:true}))
        sAw.position.set(-0.7,1,0); scene.add(sAw)
        const sBw = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.1,wireframe:true}))
        sBw.position.set(0.7,1,0); scene.add(sBw)
        const lA = makeLabel('A', '#534AB7', 0.3); lA.position.set(-1.5,3,0); scene.add(lA)
        const lB = makeLabel('B', '#1D9E75', 0.3); lB.position.set(1.5,3,0); scene.add(lB)
        const l19 = makeLabel('A∩B / A∪B / Aᶜ', '#D85A30'); l19.position.set(0,4,0); scene.add(l19)
        camera.position.set(0,2,6); scene.userData.animate = () => {}
        break
      }

      case 'proposition': {
        // H020: p→q 화살표 + 역/이/대우
        const makeArrow = (from: THREE.Vector3, to: THREE.Vector3, color: number) => {
          const dir = new THREE.Vector3().subVectors(to, from).normalize()
          const len = from.distanceTo(to)
          const arrow = new THREE.ArrowHelper(dir, from, len, color, 0.3, 0.15)
          scene.add(arrow); return arrow
        }
        // p→q (보라)
        makeArrow(new THREE.Vector3(-2,2,0), new THREE.Vector3(2,2,0), VIO)
        const lp = makeLabel('p', '#534AB7', 0.3); lp.position.set(-2.5,2,0); scene.add(lp)
        const lq = makeLabel('q', '#534AB7', 0.3); lq.position.set(2.5,2,0); scene.add(lq)
        const l20a = makeLabel('p → q (원명제)', '#534AB7', 0.2); l20a.position.set(0,2.5,0); scene.add(l20a)
        // 대우: ¬q→¬p (같은 색 = 동치)
        makeArrow(new THREE.Vector3(2,0,0), new THREE.Vector3(-2,0,0), VIO)
        const l20b = makeLabel('¬q → ¬p (대우, 동치!)', '#534AB7', 0.2); l20b.position.set(0,0.5,0); scene.add(l20b)
        // 역: q→p (다른 색)
        makeArrow(new THREE.Vector3(2,-2,0), new THREE.Vector3(-2,-2,0), ORG)
        const l20c = makeLabel('q → p (역, 다를 수 있음)', '#D85A30', 0.2); l20c.position.set(0,-1.5,0); scene.add(l20c)
        const l20r = makeLabel('대우의 진리값 = 원명제와 같다', '#1D9E75'); l20r.position.set(0,4,0); scene.add(l20r)
        camera.position.set(0,1,8); scene.userData.animate = () => { l20r.visible = Math.min(1,(t%loopLen)/360)>0.5 }
        break
      }

      // ══════════════════════════════════════════
      // H021~H040 — 공통수학2
      // ══════════════════════════════════════════

      case 'function_h': {
        // H021: 함수 — 집합 X→Y 대응
        const makeS = (x:number,y:number,z:number,c:number) => {const s=new THREE.Mesh(new THREE.SphereGeometry(0.2),new THREE.MeshPhongMaterial({color:c}));s.position.set(x,y,z);scene.add(s);return s}
        for(let i=0;i<3;i++) makeS(-2,2-i,0,VIO)
        for(let i=0;i<3;i++) makeS(2,2-i,0,GRN)
        const mkA=(f:THREE.Vector3,t2:THREE.Vector3,c:number)=>{const d=new THREE.Vector3().subVectors(t2,f).normalize();scene.add(new THREE.ArrowHelper(d,f,f.distanceTo(t2),c,0.2,0.1))}
        mkA(new THREE.Vector3(-1.7,2,0),new THREE.Vector3(1.7,2,0),VIO)
        mkA(new THREE.Vector3(-1.7,1,0),new THREE.Vector3(1.7,0,0),ORG)
        mkA(new THREE.Vector3(-1.7,0,0),new THREE.Vector3(1.7,1,0),GRN)
        const l21a=makeLabel('X',`#534AB7`,0.3);l21a.position.set(-2,3.2,0);scene.add(l21a)
        const l21b=makeLabel('Y','#1D9E75',0.3);l21b.position.set(2,3.2,0);scene.add(l21b)
        const l21r=makeLabel('하나의 x → 하나의 y','#D85A30');l21r.position.set(0,4.5,0);scene.add(l21r)
        camera.position.set(0,1.5,7);scene.userData.animate=()=>{l21r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'composite_func': {
        // H022: 합성함수 — 파이프라인
        addBox(-3,1,0,1.5,1.5,1.5,VIO,0.3);addBox(0,1,0,1.5,1.5,1.5,GRN,0.3);addBox(3,1,0,1.5,1.5,1.5,ORG,0.3)
        const l22a=makeLabel('x','#ffffff',0.25);l22a.position.set(-4.5,1,0);scene.add(l22a)
        const l22b=makeLabel('f','#534AB7',0.3);l22b.position.set(-3,2.5,0);scene.add(l22b)
        const l22c=makeLabel('g','#1D9E75',0.3);l22c.position.set(0,2.5,0);scene.add(l22c)
        const l22d=makeLabel('g(f(x))','#D85A30',0.3);l22d.position.set(3,2.5,0);scene.add(l22d)
        // 화살표
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(-2,1,0),1.5,0xffffff,0.15,0.08))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(1,1,0),1.5,0xffffff,0.15,0.08))
        const l22r=makeLabel('출력이 다음 입력이 된다','#1D9E75');l22r.position.set(0,4,0);scene.add(l22r)
        camera.position.set(0,2,8);scene.userData.animate=()=>{l22r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'inverse_func': {
        // H023: 역함수 — y=x 대칭
        const pts23a:THREE.Vector3[]=[],pts23b:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.1){pts23a.push(new THREE.Vector3(x,x*x*0.5,0));pts23b.push(new THREE.Vector3(x*x*0.5,x,0))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts23a),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts23b),new THREE.LineBasicMaterial({color:GRN})))
        // y=x 직선
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,-2,0),new THREE.Vector3(4,4,0)]),new THREE.LineBasicMaterial({color:0x444466})))
        const l23a=makeLabel('f','#534AB7',0.25);l23a.position.set(2,3,0);scene.add(l23a)
        const l23b=makeLabel('f⁻¹','#1D9E75',0.25);l23b.position.set(3,1.5,0);scene.add(l23b)
        const l23r=makeLabel('y=x에 대해 대칭','#D85A30');l23r.position.set(1,4.5,0);scene.add(l23r)
        camera.position.set(1,2,8);scene.userData.animate=()=>{l23r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'rational_func': {
        // H024: 유리함수 y=1/x + 점근선 벽
        const pts24:THREE.Vector3[]=[]
        for(let x=0.2;x<=5;x+=0.1) pts24.push(new THREE.Vector3(x,1/x,0))
        const pts24b:THREE.Vector3[]=[]
        for(let x=-5;x<=-0.2;x+=0.1) pts24b.push(new THREE.Vector3(x,1/x,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts24),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts24b),new THREE.LineBasicMaterial({color:VIO})))
        // 점근선 벽
        const wallY=new THREE.Mesh(new THREE.PlaneGeometry(0.05,8),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.2}))
        wallY.position.set(0,0,0);scene.add(wallY)
        const wallX=new THREE.Mesh(new THREE.PlaneGeometry(10,0.05),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.2}))
        wallX.position.set(0,0,0);scene.add(wallX)
        const l24=makeLabel('점근선: 가까이 가지만 닿지 않음','#D85A30');l24.position.set(0,4,0);scene.add(l24)
        camera.position.set(2,2,8);scene.userData.animate=()=>{l24.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'irrational_func': {
        // H025: 무리함수 y=√x
        const pts25:THREE.Vector3[]=[]
        for(let x=0;x<=6;x+=0.1) pts25.push(new THREE.Vector3(x,Math.sqrt(x),0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts25),new THREE.LineBasicMaterial({color:VIO})))
        // x<0 벽
        const wall25=new THREE.Mesh(new THREE.PlaneGeometry(0.1,5),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.3}))
        wall25.position.set(0,1.5,0);scene.add(wall25)
        const l25a=makeLabel('y=√x','#534AB7',0.25);l25a.position.set(4,2.5,0);scene.add(l25a)
        const l25b=makeLabel('x<0 정의 불가','#D85A30',0.2);l25b.position.set(-1.5,2,0);scene.add(l25b)
        camera.position.set(2,2,8);scene.userData.animate=()=>{}
        break
      }

      case 'arithmetic_seq': {
        // H026: 등차수열 막대 (일정 증가)
        const a26=2,d26=3,n26=7
        for(let i=0;i<n26;i++){const h26=a26+i*d26;const sc26=0.15
          const mesh=addBox(-3+i*1,h26*sc26/2,0,0.7,h26*sc26,0.7,i%2===0?VIO:GRN,0.6)
          const lb=makeLabel(String(h26),'#ffffff',0.15);lb.position.set(-3+i*1,h26*sc26+0.3,0);scene.add(lb)}
        const l26=makeLabel('공차 d=3 → 일정하게 증가','#1D9E75');l26.position.set(0,4,0);scene.add(l26)
        camera.position.set(0,3,8);scene.userData.animate=()=>{l26.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'geometric_seq': {
        // H027: 등비수열 막대 (폭발적 증가)
        const a27=1,r27=2,n27=7
        for(let i=0;i<n27;i++){const v27=a27*Math.pow(r27,i);const sc27=0.02
          const mesh=addBox(-3+i*1,v27*sc27/2,0,0.7,Math.min(v27*sc27,5),0.7,i%2===0?VIO:ORG,0.6)
          const lb=makeLabel(String(v27),'#ffffff',0.15);lb.position.set(-3+i*1,Math.min(v27*sc27,5)+0.3,0);scene.add(lb)}
        const l27=makeLabel('공비 r=2 → 2배씩 폭발','#D85A30');l27.position.set(0,4.5,0);scene.add(l27)
        camera.position.set(0,3,8);scene.userData.animate=()=>{l27.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'arithmetic_sum': {
        // H028: 가우스 합 — 오름+뒤집기=직사각형
        const n28=5
        for(let i=0;i<n28;i++){addBox(-2+i*0.9,((i+1)*0.25)/2,-0.6,0.7,(i+1)*0.25,0.7,VIO,0.5)}
        for(let i=0;i<n28;i++){addBox(-2+i*0.9,((n28-i)*0.25)/2,0.6,0.7,(n28-i)*0.25,0.7,GRN,0.4)}
        const l28=makeLabel('합치면 높이 모두 (n+1)','#D85A30');l28.position.set(0,2.5,0);scene.add(l28)
        const l28b=makeLabel('Sn = n(n+1)/2','#1D9E75');l28b.position.set(0,3.5,0);scene.add(l28b)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l28b.visible=Math.min(1,(t%loopLen)/360)>0.6}
        break
      }

      case 'geometric_sum': {
        // H029: 등비급수 1+1/2+1/4+... → 2 수렴
        let sum29=0
        for(let i=0;i<8;i++){const v29=1/Math.pow(2,i);sum29+=v29
          addBox(-3+i*0.9,v29*0.8/2,0,0.7,v29*0.8,0.7,i%3===0?VIO:i%3===1?GRN:ORG,0.5)}
        const l29=makeLabel('무한히 더해도 → 2에 수렴','#1D9E75');l29.position.set(0,3,0);scene.add(l29)
        camera.position.set(0,1.5,7);scene.userData.animate=()=>{l29.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'induction': {
        // H030: 수학적 귀납법 — 도미노
        for(let i=0;i<10;i++){
          const domino=addBox(-4+i*0.9,0.6,0,0.15,1.2,0.5,i===0?ORG:VIO,0.6)
          domino.userData={idx:i}
        }
        const l30=makeLabel('P(1) 참 → P(k)→P(k+1) → 전부 참','#1D9E75');l30.position.set(0,3,0);scene.add(l30)
        scene.userData.animate=()=>{
          const p30=Math.min(1,(t%loopLen)/360)
          objs.forEach(o=>{if(o.userData?.idx!==undefined){const i=o.userData.idx
            const fallP=Math.max(0,Math.min(1,(p30-i*0.06)*5))
            ;(o as THREE.Mesh).rotation.z=-fallP*Math.PI/2.2
            ;(o as THREE.Mesh).position.y=0.6-fallP*0.4
          }})
          l30.visible=p30>0.7
        }
        break
      }

      case 'exp_func': {
        // H031: 지수함수 y=2^x, y=(1/2)^x
        const pts31a:THREE.Vector3[]=[],pts31b:THREE.Vector3[]=[]
        for(let x=-3;x<=3;x+=0.1){pts31a.push(new THREE.Vector3(x,Math.pow(2,x)*0.3,0));pts31b.push(new THREE.Vector3(x,Math.pow(0.5,x)*0.3,0))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts31a),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts31b),new THREE.LineBasicMaterial({color:GRN})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const d31=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));d31.position.set(0,0.3,0);scene.add(d31)
        const l31a=makeLabel('y=2ˣ','#534AB7',0.25);l31a.position.set(2,3,0);scene.add(l31a)
        const l31b=makeLabel('y=(½)ˣ','#1D9E75',0.25);l31b.position.set(-2,3,0);scene.add(l31b)
        const l31r=makeLabel('항상 y>0, (0,1) 통과','#D85A30');l31r.position.set(0,4,0);scene.add(l31r)
        camera.position.set(0,2,8);scene.userData.animate=()=>{l31r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'log_func': {
        // H032: 로그함수 y=log₂x
        const pts32:THREE.Vector3[]=[]
        for(let x=0.1;x<=6;x+=0.1) pts32.push(new THREE.Vector3(x,Math.log2(x)*0.5,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts32),new THREE.LineBasicMaterial({color:VIO})))
        // y=2^x (대칭 비교)
        const pts32b:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.1) pts32b.push(new THREE.Vector3(x,Math.pow(2,x)*0.5,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts32b),new THREE.LineBasicMaterial({color:GRN,transparent:true,opacity:0.4})))
        // y=x
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1,-1,0),new THREE.Vector3(5,5*0.5,0)]),new THREE.LineBasicMaterial({color:0x444466})))
        const l32=makeLabel('지수함수의 역함수','#D85A30');l32.position.set(2,3.5,0);scene.add(l32)
        camera.position.set(2,1.5,8);scene.userData.animate=()=>{l32.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'exp_log_eq': {
        // H033: 2^x=8 → 곡선과 y=8 교차
        const pts33:THREE.Vector3[]=[]
        for(let x=-2;x<=4;x+=0.1) pts33.push(new THREE.Vector3(x,Math.pow(2,x)*0.3,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts33),new THREE.LineBasicMaterial({color:VIO})))
        // y=8 면
        const plane33=new THREE.Mesh(new THREE.PlaneGeometry(8,0.05),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.4}))
        plane33.position.set(0,8*0.3,0);scene.add(plane33)
        const d33=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:GRN}));d33.position.set(3,8*0.3,0);scene.add(d33)
        const l33=makeLabel('x=3 (2³=8)','#1D9E75',0.25);l33.position.set(3,8*0.3+0.5,0);scene.add(l33)
        camera.position.set(1,2,8);scene.userData.animate=()=>{}
        break
      }

      case 'trig_func': {
        // H034: 단위원 + sin/cos
        const circle34=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(Math.cos(a)*1.5,Math.sin(a)*1.5,0)})),new THREE.LineBasicMaterial({color:0x444466}))
        scene.add(circle34)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(2,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0),new THREE.Vector3(0,2,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const dot34=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));scene.add(dot34)
        const sinLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)]),new THREE.LineBasicMaterial({color:VIO,linewidth:2}));scene.add(sinLine)
        const cosLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)]),new THREE.LineBasicMaterial({color:GRN,linewidth:2}));scene.add(cosLine)
        camera.position.set(0,0,5)
        scene.userData.animate=()=>{
          const ang=t*0.015;const px=Math.cos(ang)*1.5,py=Math.sin(ang)*1.5
          dot34.position.set(px,py,0)
          ;(sinLine.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(px,0,0),new THREE.Vector3(px,py,0)])
          ;(cosLine.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(px,0,0)])
        }
        break
      }

      case 'trig_graph': {
        // H035: sin 파형
        const pts35:THREE.Vector3[]=[]
        for(let x=-1;x<=10;x+=0.05) pts35.push(new THREE.Vector3(x*0.5-2,Math.sin(x)*1.2,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts35),new THREE.LineBasicMaterial({color:VIO})))
        // cos
        const pts35b:THREE.Vector3[]=[]
        for(let x=-1;x<=10;x+=0.05) pts35b.push(new THREE.Vector3(x*0.5-2,Math.cos(x)*1.2,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts35b),new THREE.LineBasicMaterial({color:GRN,transparent:true,opacity:0.5})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(5,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const l35a=makeLabel('y=sinx','#534AB7',0.2);l35a.position.set(3,1.5,0);scene.add(l35a)
        const l35b=makeLabel('y=cosx','#1D9E75',0.2);l35b.position.set(3,1,0);scene.add(l35b)
        const l35r=makeLabel('주기 2π, 진폭 1','#D85A30');l35r.position.set(0,3,0);scene.add(l35r)
        camera.position.set(1,1.5,6);scene.userData.animate=()=>{l35r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'trig_addition': {
        // H036: sin(A+B) 덧셈정리
        addBox(0,0.5,0,2,0.3,2,VIO,0.2)
        const l36a=makeLabel('sin(A+B)','#534AB7',0.3);l36a.position.set(0,2,0);scene.add(l36a)
        const l36b=makeLabel('= sinAcosB + cosAsinB','#1D9E75',0.25);l36b.position.set(0,1.2,0);scene.add(l36b)
        addBox(-1,0.3,-1,0.9,0.6,0.9,VIO,0.4);const la1=makeLabel('sinAcosB','#534AB7',0.12);la1.position.set(-1,0.8,-1);scene.add(la1)
        addBox(1,0.3,1,0.9,0.6,0.9,GRN,0.4);const la2=makeLabel('cosAsinB','#1D9E75',0.12);la2.position.set(1,0.8,1);scene.add(la2)
        camera.position.set(2,3,5);scene.userData.animate=()=>{}
        break
      }

      case 'sine_rule': {
        // H037: 사인 법칙 — 삼각형+외접원
        const A37={x:0,y:2},B37={x:-1.5,y:-1},C37={x:1.5,y:-1}
        const tri37=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(A37.x,A37.y,0),new THREE.Vector3(B37.x,B37.y,0),new THREE.Vector3(C37.x,C37.y,0),new THREE.Vector3(A37.x,A37.y,0)]),new THREE.LineBasicMaterial({color:WHT}))
        scene.add(tri37)
        // 외접원
        const circ37=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(Math.cos(a)*1.8,Math.sin(a)*1.8+0.3,0)})),new THREE.LineBasicMaterial({color:ORG,transparent:true,opacity:0.5}))
        scene.add(circ37)
        const l37=makeLabel('a/sinA = b/sinB = 2R','#D85A30');l37.position.set(0,3.5,0);scene.add(l37)
        camera.position.set(0,0.5,6);scene.userData.animate=()=>{l37.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'cosine_rule': {
        // H038: 코사인 법칙 — 피타고라스 확장
        const A38={x:0,y:2},B38={x:-2,y:-1},C38={x:2,y:-1}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(A38.x,A38.y,0),new THREE.Vector3(B38.x,B38.y,0),new THREE.Vector3(C38.x,C38.y,0),new THREE.Vector3(A38.x,A38.y,0)]),new THREE.LineBasicMaterial({color:WHT})))
        const l38a=makeLabel('a','#534AB7',0.2);l38a.position.set(0,-1.3,0);scene.add(l38a)
        const l38b=makeLabel('b','#1D9E75',0.2);l38b.position.set(1.3,0.8,0);scene.add(l38b)
        const l38c=makeLabel('c','#D85A30',0.2);l38c.position.set(-1.3,0.8,0);scene.add(l38c)
        const l38r=makeLabel('a²=b²+c²-2bc·cosA','#1D9E75');l38r.position.set(0,3.5,0);scene.add(l38r)
        const l38s=makeLabel('A=90° → 피타고라스!','#D85A30',0.2);l38s.position.set(0,4.3,0);scene.add(l38s)
        camera.position.set(0,1,6);scene.userData.animate=()=>{l38s.visible=Math.min(1,(t%loopLen)/360)>0.6}
        break
      }

      case 'vector_2d': {
        // H039: 평면벡터 합
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(5,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0),new THREE.Vector3(0,4,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(3,2,0).normalize(),new THREE.Vector3(0,0,0),Math.sqrt(13),VIO,0.2,0.1))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,3,0).normalize(),new THREE.Vector3(0,0,0),Math.sqrt(10),GRN,0.2,0.1))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(4,5,0).normalize(),new THREE.Vector3(0,0,0),Math.sqrt(41),ORG,0.25,0.12))
        const l39a=makeLabel('a⃗','#534AB7',0.2);l39a.position.set(3,2.3,0);scene.add(l39a)
        const l39b=makeLabel('b⃗','#1D9E75',0.2);l39b.position.set(1,3.3,0);scene.add(l39b)
        const l39c=makeLabel('a⃗+b⃗','#D85A30',0.2);l39c.position.set(4,5.3,0);scene.add(l39c)
        camera.position.set(2,2,8);scene.userData.animate=()=>{}
        break
      }

      case 'dot_product': {
        // H040: 내적 — 사이각 θ
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,0),3,VIO,0.2,0.1))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(0.7,0.7,0).normalize(),new THREE.Vector3(0,0,0),2.5,GRN,0.2,0.1))
        // 사이각 호
        const arc40=new THREE.BufferGeometry()
        const arcPts:THREE.Vector3[]=[];for(let a=0;a<=Math.PI/4;a+=0.05) arcPts.push(new THREE.Vector3(Math.cos(a)*0.8,Math.sin(a)*0.8,0))
        arc40.setFromPoints(arcPts)
        scene.add(new THREE.Line(arc40,new THREE.LineBasicMaterial({color:ORG})))
        const l40a=makeLabel('a⃗','#534AB7',0.2);l40a.position.set(3,0.3,0);scene.add(l40a)
        const l40b=makeLabel('b⃗','#1D9E75',0.2);l40b.position.set(1.5,1.8,0);scene.add(l40b)
        const l40c=makeLabel('θ','#D85A30',0.2);l40c.position.set(1,0.5,0);scene.add(l40c)
        const l40r=makeLabel('a⃗·b⃗ = |a||b|cosθ','#1D9E75');l40r.position.set(1.5,3.5,0);scene.add(l40r)
        const l40s=makeLabel('θ=90° → 내적=0 → 수직','#D85A30',0.2);l40s.position.set(1.5,4.3,0);scene.add(l40s)
        camera.position.set(1.5,1.5,6);scene.userData.animate=()=>{l40s.visible=Math.min(1,(t%loopLen)/360)>0.6}
        break
      }

      // ══════════════════════════════════════════
      // H041~H055 — 미적분Ⅰ
      // ══════════════════════════════════════════

      case 'seq_limit': {
        // H041: 수열의 극한 1/n→0
        for(let i=1;i<=10;i++){const h41=1/i;addBox(-4.5+i*0.9,h41*1.5/2,0,0.7,h41*1.5,0.7,i%2===0?VIO:GRN,0.6)
          const lb41=makeLabel(`1/${i}`,'#ffffff',0.12);lb41.position.set(-4.5+i*0.9,h41*1.5+0.3,0);scene.add(lb41)}
        // 극한선 y=0
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5,0,0),new THREE.Vector3(6,0,0)]),new THREE.LineBasicMaterial({color:ORG})))
        const l41=makeLabel('n→∞이면 1/n→0','#D85A30');l41.position.set(0,3,0);scene.add(l41)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l41.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'series': {
        // H042: 급수 1/2+1/4+1/8...→1 블록 쌓기
        let y42=0
        for(let i=0;i<8;i++){const h42=1/Math.pow(2,i+1)*2;addBox(0,y42+h42/2,0,2,h42,2,i%3===0?VIO:i%3===1?GRN:ORG,0.4);y42+=h42}
        // 전체=1 외곽
        const wire42=new THREE.Mesh(new THREE.BoxGeometry(2.1,2.1,2.1),new THREE.MeshPhongMaterial({color:WHT,transparent:true,opacity:0.05,wireframe:true}))
        wire42.position.set(0,1,0);scene.add(wire42)
        const l42=makeLabel('무한히 더해도 → 1에 수렴','#1D9E75');l42.position.set(0,3.5,0);scene.add(l42)
        camera.position.set(2,2,5);scene.userData.animate=()=>{l42.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'func_limit': {
        // H043: 함수의 극한 — 양쪽에서 접근
        const pts43:THREE.Vector3[]=[]
        for(let x=-3;x<=3;x+=0.05){if(Math.abs(x-1)<0.05)continue;pts43.push(new THREE.Vector3(x,(x-1)*(x-1)+1,0))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts43),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(5,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        // 구멍 or 극한점
        const dot43=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));dot43.position.set(1,1,0);scene.add(dot43)
        // 화살표 (양쪽에서 접근)
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0).normalize(),new THREE.Vector3(-1,5,0),1.5,GRN,0.15,0.08))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(-1,0,0).normalize(),new THREE.Vector3(3,5,0),1.5,GRN,0.15,0.08))
        const l43=makeLabel('x→1일 때 f(x)→1','#1D9E75');l43.position.set(1,3.5,0);scene.add(l43)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l43.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'continuity': {
        // H044: 연속 vs 불연속
        // 연속 곡선
        const pts44a:THREE.Vector3[]=[]
        for(let x=-3;x<=3;x+=0.05) pts44a.push(new THREE.Vector3(x,Math.sin(x)*1.5+1.5,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts44a),new THREE.LineBasicMaterial({color:VIO})))
        // 불연속 (구멍)
        const pts44b:THREE.Vector3[]=[]
        for(let x=-3;x<=3;x+=0.05){if(Math.abs(x)<0.1)continue;pts44b.push(new THREE.Vector3(x,x>0?x*0.5+0.5:x*0.5-0.5,-2))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts44b),new THREE.LineBasicMaterial({color:ORG})))
        const hole44=new THREE.Mesh(new THREE.RingGeometry(0.08,0.15,16),new THREE.MeshPhongMaterial({color:ORG,side:THREE.DoubleSide}));hole44.position.set(0,-0.5,-2);scene.add(hole44)
        const l44a=makeLabel('연속 ✓','#534AB7',0.25);l44a.position.set(0,3.5,0);scene.add(l44a)
        const l44b=makeLabel('불연속 ✗','#D85A30',0.25);l44b.position.set(0,3.5,-2);scene.add(l44b)
        camera.position.set(0,2,6);scene.userData.animate=()=>{}
        break
      }

      case 'derivative_coeff': {
        // H045: 미분계수 — 할선→접선
        const pts45:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.05) pts45.push(new THREE.Vector3(x,x*x*0.5,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts45),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const dotP=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));dotP.position.set(1,0.5,0);scene.add(dotP)
        const dotQ=new THREE.Mesh(new THREE.SphereGeometry(0.08),new THREE.MeshPhongMaterial({color:GRN}));scene.add(dotQ)
        const secLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)]),new THREE.LineBasicMaterial({color:GRN}));scene.add(secLine)
        const l45=makeLabel('할선→접선 (h→0)','#1D9E75');l45.position.set(0,3.5,0);scene.add(l45)
        camera.position.set(0.5,1.5,6)
        scene.userData.animate=()=>{
          const p45=Math.min(1,(t%loopLen)/360);const h45=3*(1-p45)+0.01;const qx=1+h45,qy=qx*qx*0.5
          dotQ.position.set(qx,qy,0);const slope=(qy-0.5)/h45
          ;(secLine.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(1-1,0.5-slope,0),new THREE.Vector3(1+2,0.5+slope*2,0)])
          l45.visible=p45>0.7
        }
        break
      }

      case 'derivative_func': {
        // H046: 도함수 — f→f' 점 찍기
        const pts46:THREE.Vector3[]=[];const pts46d:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.05){pts46.push(new THREE.Vector3(x,x*x*0.3-0.5,0));pts46d.push(new THREE.Vector3(x,x*0.6,-2))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts46),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts46d),new THREE.LineBasicMaterial({color:GRN})))
        const l46a=makeLabel('f(x)','#534AB7',0.25);l46a.position.set(2.5,2,0);scene.add(l46a)
        const l46b=makeLabel("f'(x)",'#1D9E75',0.25);l46b.position.set(2.5,1.5,-2);scene.add(l46b)
        const l46r=makeLabel('모든 점의 기울기 → 도함수','#D85A30');l46r.position.set(0,3.5,-1);scene.add(l46r)
        camera.position.set(1,2,6);scene.userData.animate=()=>{l46r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'diff_formula': {
        // H047: (xⁿ)'=nxⁿ⁻¹
        const pts47:THREE.Vector3[]=[];const pts47d:THREE.Vector3[]=[]
        for(let x=-2;x<=2;x+=0.05){pts47.push(new THREE.Vector3(x,x*x*x*0.2,0));pts47d.push(new THREE.Vector3(x,3*x*x*0.2,-2))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts47),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts47d),new THREE.LineBasicMaterial({color:GRN})))
        const l47a=makeLabel('y=x³','#534AB7',0.25);l47a.position.set(2,2,0);scene.add(l47a)
        const l47b=makeLabel("y'=3x²",'#1D9E75',0.25);l47b.position.set(2,2,-2);scene.add(l47b)
        const l47r=makeLabel("(xⁿ)' = nxⁿ⁻¹",'#D85A30');l47r.position.set(0,3.5,-1);scene.add(l47r)
        camera.position.set(1,2,6);scene.userData.animate=()=>{l47r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'diff_application': {
        // H048: 증가감소 — f'(x)>0 오르막, <0 내리막
        const pts48:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.05) pts48.push(new THREE.Vector3(x,(x-0.5)*(x-0.5)*(x-2)*0.5+1,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts48),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        // 극대/극소 점
        const dMax=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:ORG}));dMax.position.set(0.5,1,0);scene.add(dMax)
        const dMin=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:GRN}));dMin.position.set(2,0.5,0);scene.add(dMin)
        const l48a=makeLabel('극대','#D85A30',0.2);l48a.position.set(0.5,1.5,0);scene.add(l48a)
        const l48b=makeLabel('극소','#1D9E75',0.2);l48b.position.set(2,0,0);scene.add(l48b)
        const l48r=makeLabel("f'>0 증가, f'<0 감소, f'=0 극값",'#D85A30');l48r.position.set(0,3.5,0);scene.add(l48r)
        camera.position.set(0.5,2,7);scene.userData.animate=()=>{l48r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'max_min': {
        // H049: 최대·최소 — 닫힌 구간
        const pts49:THREE.Vector3[]=[]
        for(let x=-1;x<=3;x+=0.05) pts49.push(new THREE.Vector3(x,(x-1)*(x-1)*(x-2)*0.8+1,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts49),new THREE.LineBasicMaterial({color:VIO})))
        // 구간 [a,b] 벽
        const wallA=new THREE.Mesh(new THREE.PlaneGeometry(0.05,4),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.3}));wallA.position.set(-1,1,0);scene.add(wallA)
        const wallB=new THREE.Mesh(new THREE.PlaneGeometry(0.05,4),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.3}));wallB.position.set(3,1,0);scene.add(wallB)
        const dMax49=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:GRN}));dMax49.position.set(-1,2.6,0);scene.add(dMax49)
        const l49=makeLabel('최대/최소: 극값+양끝점 비교','#1D9E75');l49.position.set(1,4,0);scene.add(l49)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l49.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'tangent_line': {
        // H050: 접선의 방정식
        const pts50:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.05) pts50.push(new THREE.Vector3(x,x*x*0.4,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts50),new THREE.LineBasicMaterial({color:VIO})))
        const a50=1,fa=a50*a50*0.4,fda=2*a50*0.4
        const dot50=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));dot50.position.set(a50,fa,0);scene.add(dot50)
        // 접선
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a50-2,fa-fda*2,0),new THREE.Vector3(a50+2,fa+fda*2,0)]),new THREE.LineBasicMaterial({color:GRN})))
        const l50=makeLabel("y-f(a)=f'(a)(x-a)",'#1D9E75');l50.position.set(1,3,0);scene.add(l50)
        camera.position.set(0.5,1.5,6);scene.userData.animate=()=>{l50.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'indefinite_integral': {
        // H051: 부정적분 — f'→f +C 여러 곡선
        const colors51=[VIO,GRN,ORG]
        for(let c51=0;c51<3;c51++){const pts51:THREE.Vector3[]=[]
          for(let x=-2;x<=3;x+=0.05) pts51.push(new THREE.Vector3(x,x*x*0.3-1+c51*0.8,0))
          scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts51),new THREE.LineBasicMaterial({color:colors51[c51],transparent:true,opacity:c51===1?1:0.4})))}
        const l51a=makeLabel('C=0','#1D9E75',0.2);l51a.position.set(2.5,1.5,0);scene.add(l51a)
        const l51b=makeLabel('+C에 따라 위아래 이동','#D85A30');l51b.position.set(0,4,0);scene.add(l51b)
        camera.position.set(0.5,2,7);scene.userData.animate=()=>{l51b.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'definite_integral': {
        // H052: 정적분 — 리만 합 채우기
        const pts52:THREE.Vector3[]=[]
        for(let x=-1;x<=3;x+=0.05) pts52.push(new THREE.Vector3(x,x*x*0.3+0.5,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts52),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        // 리만 합 막대
        for(let i=0;i<10;i++){const x52=i*0.3;const h52=x52*x52*0.3+0.5
          addBox(x52,h52/2,0,0.28,h52,0.3,i%2===0?VIO:GRN,0.3)}
        const l52=makeLabel('∫₀³ f(x)dx = F(3)-F(0)','#1D9E75');l52.position.set(1,4,0);scene.add(l52)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l52.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'area_integral': {
        // H053: 두 곡선 사이 넓이
        const pts53a:THREE.Vector3[]=[],pts53b:THREE.Vector3[]=[]
        for(let x=-1;x<=3;x+=0.05){pts53a.push(new THREE.Vector3(x,x*0.5+1,0));pts53b.push(new THREE.Vector3(x,x*x*0.2,0))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts53a),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts53b),new THREE.LineBasicMaterial({color:GRN})))
        // 사이 영역 막대
        for(let i=0;i<12;i++){const x53=i*0.3;const top53=x53*0.5+1;const bot53=x53*x53*0.2;const h53=top53-bot53
          if(h53>0) addBox(x53,bot53+h53/2,0,0.25,h53,0.3,ORG,0.25)}
        const l53=makeLabel('∫[f(x)-g(x)]dx','#D85A30');l53.position.set(1,3.5,0);scene.add(l53)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l53.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'series_sum': {
        // H054: 1²+2²+...+n² 막대
        const n54=6
        for(let i=1;i<=n54;i++){const h54=i*i*0.08
          addBox(-3+i*1,h54/2,0,0.7,h54,0.7,i%3===0?VIO:i%3===1?GRN:ORG,0.5)
          const lb54=makeLabel(`${i}²=${i*i}`,'#ffffff',0.12);lb54.position.set(-3+i*1,h54+0.3,0);scene.add(lb54)}
        const sum54=n54*(n54+1)*(2*n54+1)/6
        const l54=makeLabel(`합 = n(n+1)(2n+1)/6 = ${sum54}`,'#1D9E75');l54.position.set(0,4,0);scene.add(l54)
        camera.position.set(0,3,8);scene.userData.animate=()=>{l54.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'fundamental_theorem': {
        // H055: 미적분 기본 정리 — 넓이 변화율=f(x)
        const pts55:THREE.Vector3[]=[]
        for(let x=-1;x<=3;x+=0.05) pts55.push(new THREE.Vector3(x,Math.sin(x)*1.2+1,0))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts55),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        // 이동하는 x선
        const xLine55=new THREE.Mesh(new THREE.PlaneGeometry(0.04,3),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.5}));scene.add(xLine55)
        const l55=makeLabel('d/dx ∫f(t)dt = f(x)','#1D9E75');l55.position.set(1,3.5,0);scene.add(l55)
        const l55b=makeLabel('미분과 적분은 역연산!','#D85A30');l55b.position.set(1,4.3,0);scene.add(l55b)
        camera.position.set(1,2,7)
        scene.userData.animate=()=>{
          const xPos=((t%300)/300)*4-1;xLine55.position.set(xPos,1,0)
          l55.visible=Math.min(1,(t%loopLen)/360)>0.4;l55b.visible=Math.min(1,(t%loopLen)/360)>0.6
        }
        break
      }

      // ══════════════════════════════════════════
      // H056~H075 — 확률통계 + 기하
      // ══════════════════════════════════════════

      case 'prob_addition': {
        // H056: 확률 덧셈정리 — 벤 다이어그램
        const sA56=new THREE.Mesh(new THREE.SphereGeometry(1.3,32,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15}));sA56.position.set(-0.6,1,0);scene.add(sA56)
        const sB56=new THREE.Mesh(new THREE.SphereGeometry(1.3,32,32),new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.15}));sB56.position.set(0.6,1,0);scene.add(sB56)
        const lA56=makeLabel('P(A)','#534AB7',0.2);lA56.position.set(-1.5,2.8,0);scene.add(lA56)
        const lB56=makeLabel('P(B)','#1D9E75',0.2);lB56.position.set(1.5,2.8,0);scene.add(lB56)
        const l56=makeLabel('P(A∪B)=P(A)+P(B)-P(A∩B)','#D85A30');l56.position.set(0,4,0);scene.add(l56)
        const l56b=makeLabel('-P(A∩B) 겹침 빼기','#D85A30',0.2);l56b.position.set(0,0,0);scene.add(l56b)
        camera.position.set(0,2,6);scene.userData.animate=()=>{l56.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'conditional_prob': {
        // H057: 조건부확률 — 상자 축소
        const box57=addBox(0,1,0,3,2,2,VIO,0.1)
        const boxA=addBox(-0.5,1,0,1.5,2,2,ORG,0.15)
        const dot57=new THREE.Mesh(new THREE.SphereGeometry(0.2),new THREE.MeshPhongMaterial({color:GRN}));dot57.position.set(-0.3,1.2,0);scene.add(dot57)
        const l57a=makeLabel('전체 Ω','#534AB7',0.2);l57a.position.set(1.5,2.5,0);scene.add(l57a)
        const l57b=makeLabel('A 영역','#D85A30',0.2);l57b.position.set(-0.5,2.5,0);scene.add(l57b)
        const l57c=makeLabel('B','#1D9E75',0.15);l57c.position.set(-0.3,1.6,0);scene.add(l57c)
        const l57r=makeLabel('P(B|A) = P(A∩B)/P(A)','#1D9E75');l57r.position.set(0,4,0);scene.add(l57r)
        camera.position.set(0,2,6);scene.userData.animate=()=>{l57r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'independence': {
        // H058: 독립과 종속
        addBox(-2,1,0,1.5,1.5,1.5,VIO,0.2);addBox(2,1,0,1.5,1.5,1.5,GRN,0.2)
        const l58a=makeLabel('A','#534AB7',0.3);l58a.position.set(-2,2.5,0);scene.add(l58a)
        const l58b=makeLabel('B','#1D9E75',0.3);l58b.position.set(2,2.5,0);scene.add(l58b)
        const l58c=makeLabel('서로 영향 없음 → 독립','#D85A30',0.2);l58c.position.set(0,0,0);scene.add(l58c)
        const l58r=makeLabel('P(A∩B) = P(A)×P(B)','#1D9E75');l58r.position.set(0,4,0);scene.add(l58r)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l58r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'discrete_rv': {
        // H059: 이산확률변수 — 주사위 막대
        for(let i=1;i<=6;i++){addBox(-3+i*1,(1/6)*3/2,0,0.7,(1/6)*3,0.7,i%2===0?VIO:GRN,0.5)
          const lb=makeLabel(String(i),'#ffffff',0.15);lb.position.set(-3+i*1,-0.3,0);scene.add(lb)}
        // 기댓값 선
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3+3.5,(1/6)*3,1),new THREE.Vector3(-3+3.5,(1/6)*3,-1)]),new THREE.LineBasicMaterial({color:ORG})))
        const l59=makeLabel('E(X)=3.5 (기댓값)','#D85A30');l59.position.set(0,3,0);scene.add(l59)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l59.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'binomial_dist': {
        // H060: 이항분포 B(10,0.5) → 종 모양
        const n60=10,p60=0.5
        const binom=(n2:number,k:number,pp:number)=>{let c=1;for(let i=0;i<k;i++){c*=(n2-i)/(i+1)};return c*Math.pow(pp,k)*Math.pow(1-pp,n2-k)}
        for(let k=0;k<=n60;k++){const prob=binom(n60,k,p60);addBox(-5+k*1,prob*10/2,0,0.7,prob*10,0.7,k===5?ORG:VIO,0.5)
          const lb=makeLabel(String(k),'#ffffff',0.1);lb.position.set(-5+k*1,-0.3,0);scene.add(lb)}
        const l60=makeLabel('B(10, 0.5) → 종 모양','#1D9E75');l60.position.set(0,4,0);scene.add(l60)
        camera.position.set(0,3,8);scene.userData.animate=()=>{l60.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'normal_dist': {
        // H061: 정규분포 — 3D 종 곡선
        const pts61:THREE.Vector3[]=[]
        for(let x=-4;x<=4;x+=0.05){const y61=(1/Math.sqrt(2*Math.PI))*Math.exp(-x*x/2)*3;pts61.push(new THREE.Vector3(x,y61,0))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts61),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5,0,0),new THREE.Vector3(5,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        // 68% 영역
        for(let x=-1;x<=1;x+=0.2){const y61=(1/Math.sqrt(2*Math.PI))*Math.exp(-x*x/2)*3;addBox(x,y61/2,0,0.18,y61,0.3,VIO,0.2)}
        const l61a=makeLabel('μ','#D85A30',0.25);l61a.position.set(0,-0.5,0);scene.add(l61a)
        const l61b=makeLabel('68%','#534AB7',0.2);l61b.position.set(0,0.5,0);scene.add(l61b)
        const l61r=makeLabel('N(μ, σ²) 정규분포','#1D9E75');l61r.position.set(0,3,0);scene.add(l61r)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l61r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'sampling_dist': {
        // H062: 표본평균 분포 — n↑ 분포 좁아짐
        const pts62a:THREE.Vector3[]=[],pts62b:THREE.Vector3[]=[]
        for(let x=-4;x<=4;x+=0.05){
          pts62a.push(new THREE.Vector3(x,(1/Math.sqrt(2*Math.PI))*Math.exp(-x*x/2)*2,0))
          pts62b.push(new THREE.Vector3(x,(1/Math.sqrt(2*Math.PI*0.25))*Math.exp(-x*x/(2*0.25))*2,-2))
        }
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts62a),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts62b),new THREE.LineBasicMaterial({color:GRN})))
        const l62a=makeLabel('n=1','#534AB7',0.2);l62a.position.set(2,1.5,0);scene.add(l62a)
        const l62b=makeLabel('n=16','#1D9E75',0.2);l62b.position.set(1,2,-2);scene.add(l62b)
        const l62r=makeLabel('n↑ → 분포 좁아짐','#D85A30');l62r.position.set(0,3.5,-1);scene.add(l62r)
        camera.position.set(0,2,6);scene.userData.animate=()=>{l62r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'confidence_interval': {
        // H063: 신뢰구간
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x444466})))
        const center63=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:ORG}));center63.position.set(0,0,0);scene.add(center63)
        const bar63=new THREE.Mesh(new THREE.BoxGeometry(3,0.2,0.2),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.4}));bar63.position.set(0,0.3,0);scene.add(bar63)
        const l63a=makeLabel('x̄','#D85A30',0.2);l63a.position.set(0,0.8,0);scene.add(l63a)
        const l63b=makeLabel('← 95% 신뢰구간 →','#534AB7',0.2);l63b.position.set(0,1.5,0);scene.add(l63b)
        const l63r=makeLabel('이 안에 모평균이 있을 확률 95%','#1D9E75');l63r.position.set(0,3,0);scene.add(l63r)
        camera.position.set(0,1.5,6);scene.userData.animate=()=>{l63r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'proportion_estimate': {
        // H064: 모비율 추정
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(3,0,0)]),new THREE.LineBasicMaterial({color:0x444466})))
        const dot64=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));dot64.position.set(0,0,0);scene.add(dot64)
        const bar64=new THREE.Mesh(new THREE.BoxGeometry(2,0.15,0.15),new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.4}));bar64.position.set(0,0.2,0);scene.add(bar64)
        const l64a=makeLabel('p̂','#D85A30',0.2);l64a.position.set(0,0.6,0);scene.add(l64a)
        const l64r=makeLabel('p̂ ± z√(p̂(1-p̂)/n)','#1D9E75');l64r.position.set(0,2.5,0);scene.add(l64r)
        camera.position.set(0,1.5,5);scene.userData.animate=()=>{l64r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'trig_identity': {
        // H065: sin²+cos²=1 — 단위원+직각삼각형
        const circle65=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(Math.cos(a)*1.5,Math.sin(a)*1.5,0)})),new THREE.LineBasicMaterial({color:0x444466}))
        scene.add(circle65)
        const dot65=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));scene.add(dot65)
        const triLine65=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:WHT}));scene.add(triLine65)
        const sinL65=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:VIO}));scene.add(sinL65)
        const cosL65=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:GRN}));scene.add(cosL65)
        const l65=makeLabel('sin²θ + cos²θ = 1','#D85A30');l65.position.set(0,3,0);scene.add(l65)
        camera.position.set(0,0,5)
        scene.userData.animate=()=>{
          const ang=t*0.01+0.5;const px=Math.cos(ang)*1.5,py=Math.sin(ang)*1.5
          dot65.position.set(px,py,0)
          ;(triLine65.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(px,0,0),new THREE.Vector3(px,py,0),new THREE.Vector3(0,0,0)])
          ;(sinL65.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(px,0,0),new THREE.Vector3(px,py,0)])
          ;(cosL65.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(px,0,0)])
          l65.visible=Math.min(1,(t%loopLen)/360)>0.3
        }
        break
      }

      case 'line_eq': {
        // H066: 직선의 방정식
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-3,0),new THREE.Vector3(0,3,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const d66a=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:VIO}));d66a.position.set(-1,-1,0);scene.add(d66a)
        const d66b=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:VIO}));d66b.position.set(2,2,0);scene.add(d66b)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,-2,0),new THREE.Vector3(3,3,0)]),new THREE.LineBasicMaterial({color:GRN})))
        const l66=makeLabel('y=x → ax+by+c=0','#1D9E75');l66.position.set(0,3.5,0);scene.add(l66)
        camera.position.set(0,1,7);scene.userData.animate=()=>{l66.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'circle_eq': {
        // H067: 원의 방정식
        const circle67=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(1+Math.cos(a)*2,1+Math.sin(a)*2,0)})),new THREE.LineBasicMaterial({color:VIO}))
        scene.add(circle67)
        const center67=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshPhongMaterial({color:ORG}));center67.position.set(1,1,0);scene.add(center67)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1,1,0),new THREE.Vector3(3,1,0)]),new THREE.LineBasicMaterial({color:ORG})))
        const l67a=makeLabel('(1,1)','#D85A30',0.2);l67a.position.set(1,0.3,0);scene.add(l67a)
        const l67b=makeLabel('r=2','#D85A30',0.2);l67b.position.set(2,1.3,0);scene.add(l67b)
        const l67r=makeLabel('(x-1)²+(y-1)²=4','#1D9E75');l67r.position.set(1,4,0);scene.add(l67r)
        camera.position.set(1,1,7);scene.userData.animate=()=>{l67r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'transformation': {
        // H068: 도형 이동 — 평행이동+대칭
        // 원본 삼각형
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0),new THREE.Vector3(-1,2,0),new THREE.Vector3(0,0,0),new THREE.Vector3(-2,0,0)]),new THREE.LineBasicMaterial({color:VIO})))
        // 평행이동
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1,1,0),new THREE.Vector3(2,3,0),new THREE.Vector3(3,1,0),new THREE.Vector3(1,1,0)]),new THREE.LineBasicMaterial({color:GRN})))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0.3,0).normalize(),new THREE.Vector3(0,1,0),2,ORG,0.15,0.08))
        const l68a=makeLabel('원본','#534AB7',0.2);l68a.position.set(-1,2.5,0);scene.add(l68a)
        const l68b=makeLabel('평행이동','#1D9E75',0.2);l68b.position.set(2,3.5,0);scene.add(l68b)
        const l68r=makeLabel('(x,y)→(x+a,y+b)','#D85A30');l68r.position.set(0,4.5,0);scene.add(l68r)
        camera.position.set(0.5,2,7);scene.userData.animate=()=>{l68r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'conic_section': {
        // H069: 이차곡선 — 원뿔 절단
        const cone69=new THREE.Mesh(new THREE.ConeGeometry(2,4,32,1,true),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15,side:THREE.DoubleSide}))
        cone69.position.set(0,2,0);scene.add(cone69)
        const coneWire=new THREE.Mesh(new THREE.ConeGeometry(2,4,32,1,true),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.2,wireframe:true}))
        coneWire.position.set(0,2,0);scene.add(coneWire)
        // 자르는 평면
        const cutPlane=new THREE.Mesh(new THREE.PlaneGeometry(5,5),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.15,side:THREE.DoubleSide}))
        cutPlane.position.set(0,2,0);scene.add(cutPlane)
        const l69=makeLabel('원뿔을 자르는 각도 → 원/타원/포물선/쌍곡선','#1D9E75');l69.position.set(0,5,0);scene.add(l69)
        camera.position.set(3,3,5)
        scene.userData.animate=()=>{cutPlane.rotation.x=Math.sin(t*0.005)*0.8;l69.visible=Math.min(1,(t%loopLen)/360)>0.3}
        break
      }

      case 'space_vector': {
        // H070: 공간좌표+벡터
        // 3축
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,0),3,0xff4444,0.15,0.08))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0),3,0x44ff44,0.15,0.08))
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0),3,0x4444ff,0.15,0.08))
        const lx=makeLabel('x','#ff4444',0.2);lx.position.set(3.3,0,0);scene.add(lx)
        const ly=makeLabel('y','#44ff44',0.2);ly.position.set(0,3.3,0);scene.add(ly)
        const lz=makeLabel('z','#4444ff',0.2);lz.position.set(0,0,3.3);scene.add(lz)
        // 점 P
        const p70=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:ORG}));p70.position.set(2,1.5,1);scene.add(p70)
        const l70a=makeLabel('P(2,1.5,1)','#D85A30',0.2);l70a.position.set(2,2,1);scene.add(l70a)
        // 벡터
        scene.add(new THREE.ArrowHelper(new THREE.Vector3(2,1.5,1).normalize(),new THREE.Vector3(0,0,0),new THREE.Vector3(2,1.5,1).length(),VIO,0.15,0.08))
        const l70r=makeLabel('2D → 3D 확장','#1D9E75');l70r.position.set(0,4,0);scene.add(l70r)
        camera.position.set(4,3,4);scene.userData.animate=()=>{l70r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'exponent_viz': {
        // H071: 0승과 음의 지수 — ÷2 패턴
        const vals71=[8,4,2,1,0.5,0.25]
        const labels71=['2³','2²','2¹','2⁰','2⁻¹','2⁻²']
        for(let i=0;i<vals71.length;i++){const h71=vals71[i]*0.3
          addBox(-3+i*1.2,h71/2,0,0.8,Math.max(0.05,h71),0.8,i<3?VIO:i===3?ORG:GRN,0.5)
          const lb=makeLabel(labels71[i],'#ffffff',0.15);lb.position.set(-3+i*1.2,Math.max(h71,0.1)+0.3,0);scene.add(lb)}
        const l71=makeLabel('÷2 패턴 → 2⁰=1','#D85A30');l71.position.set(0,4,0);scene.add(l71)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l71.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'coordinate_plane': {
        // H072~H074: 좌표 (중점/무게중심/평행수직)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0),new THREE.Vector3(3,0,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-3,0),new THREE.Vector3(0,3,0)]),new THREE.LineBasicMaterial({color:0x333355})))
        const dA=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:VIO}));dA.position.set(-2,-1,0);scene.add(dA)
        const dB=new THREE.Mesh(new THREE.SphereGeometry(0.12),new THREE.MeshPhongMaterial({color:GRN}));dB.position.set(2,3,0);scene.add(dB)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,-1,0),new THREE.Vector3(2,3,0)]),new THREE.LineBasicMaterial({color:0x555577})))
        const dM=new THREE.Mesh(new THREE.SphereGeometry(0.15),new THREE.MeshPhongMaterial({color:ORG}));dM.position.set(0,1,0);scene.add(dM)
        const lA=makeLabel('A(-2,-1)','#534AB7',0.2);lA.position.set(-2,-1.8,0);scene.add(lA)
        const lB=makeLabel('B(2,3)','#1D9E75',0.2);lB.position.set(2,3.5,0);scene.add(lB)
        const lM=makeLabel('M(0,1)','#D85A30',0.2);lM.position.set(0.5,1.5,0);scene.add(lM)
        const lr=makeLabel('중점 = 좌표 평균','#1D9E75');lr.position.set(0,4.5,0);scene.add(lr)
        camera.position.set(0,1,7);scene.userData.animate=()=>{lr.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'diff_rules': {
        // H075: 여러 가지 미분법
        const pts75a:THREE.Vector3[]=[],pts75b:THREE.Vector3[]=[],pts75c:THREE.Vector3[]=[]
        for(let x=-2;x<=3;x+=0.05){pts75a.push(new THREE.Vector3(x,Math.sin(x)*1.5+1,0));pts75b.push(new THREE.Vector3(x,x*0.5+0.5,-1.5));pts75c.push(new THREE.Vector3(x,(Math.sin(x)*1.5+1)*(x*0.5+0.5)*0.3,-3))}
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts75a),new THREE.LineBasicMaterial({color:VIO})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts75b),new THREE.LineBasicMaterial({color:GRN})))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts75c),new THREE.LineBasicMaterial({color:ORG})))
        const l75a=makeLabel('f','#534AB7',0.2);l75a.position.set(2.5,2.5,0);scene.add(l75a)
        const l75b=makeLabel('g','#1D9E75',0.2);l75b.position.set(2.5,2,-1.5);scene.add(l75b)
        const l75c=makeLabel('f·g','#D85A30',0.2);l75c.position.set(2.5,1,-3);scene.add(l75c)
        const l75r=makeLabel("(fg)' = f'g + fg'",'#D85A30');l75r.position.set(0,4,-1.5);scene.add(l75r)
        camera.position.set(1,2,6);scene.userData.animate=()=>{l75r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      // ══════════════════════════════════════════
      // 중등 ★3D (7개)
      // ══════════════════════════════════════════

      case 'pythagoras_viz': {
        // M045: 피타고라스 — 정사각형 블록 솟아오름
        const a=3,b=4,c=5,sc=0.4
        // 삼각형
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(b*sc,0,0),new THREE.Vector3(0,a*sc,0),new THREE.Vector3(0,0,0)]),new THREE.LineBasicMaterial({color:WHT,linewidth:2})))
        // a² 정사각형
        const sqA=addBox(-a*sc/2,a*sc/2,0,a*sc,a*sc,0.3,VIO,0.4);sqA.visible=false
        // b² 정사각형
        const sqB=addBox(b*sc/2,-b*sc/2,0,b*sc,b*sc,0.3,GRN,0.4);sqB.visible=false
        // c² 정사각형 (빗변)
        const sqC=addBox(b*sc/2+0.5,a*sc/2+0.5,0,c*sc,c*sc,0.3,ORG,0.3);sqC.visible=false
        const lA=makeLabel('a²=9','#534AB7',0.2);lA.position.set(-a*sc/2,a*sc+0.3,0);scene.add(lA);lA.visible=false
        const lB=makeLabel('b²=16','#1D9E75',0.2);lB.position.set(b*sc/2,-b*sc-0.3,0);scene.add(lB);lB.visible=false
        const lR=makeLabel('a²+b²=c² → 9+16=25','#D85A30');lR.position.set(1,4,0);scene.add(lR);lR.visible=false
        // 파티클
        const particles=new THREE.Points(new THREE.BufferGeometry().setFromPoints(Array.from({length:50},()=>new THREE.Vector3((Math.random()-0.5)*6,Math.random()*4,(Math.random()-0.5)*2))),new THREE.PointsMaterial({color:VIO,size:0.05,transparent:true,opacity:0.4}))
        scene.add(particles)
        camera.position.set(2,2,6)
        scene.userData.animate=()=>{
          const p2=Math.min(1,(t%loopLen)/360)
          sqA.visible=p2>0.15;sqB.visible=p2>0.3;sqC.visible=p2>0.5
          lA.visible=p2>0.2;lB.visible=p2>0.35;lR.visible=p2>0.7
          if(p2>0.15) sqA.scale.y=Math.min(1,((p2-0.15)*5))*3+0.01
          if(p2>0.3) sqB.scale.y=Math.min(1,((p2-0.3)*5))*3+0.01
          if(p2>0.5) sqC.scale.y=Math.min(1,((p2-0.5)*5))*3+0.01
          particles.rotation.y=t*0.002
        }
        break
      }

      case 'similarity_volume': {
        // M049: 닮음비 1:2 부피비 1:8 — 정육면체
        const small=addBox(-2.5,0.5,0,1,1,1,VIO,0.5)
        const lS=makeLabel('1³=1','#534AB7',0.2);lS.position.set(-2.5,1.8,0);scene.add(lS)
        // 큰 정육면체 = 작은 8개
        for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let z=0;z<2;z++){
          const block=addBox(1+x*1.05,0.5+y*1.05,z*1.05-0.5,1,1,1,GRN,0.25)
          block.userData={targetOpacity:0.25}
        }
        const lL=makeLabel('2³=8','#1D9E75',0.2);lL.position.set(1.5,3,0);scene.add(lL)
        const lR2=makeLabel('닮음비 1:2 → 부피비 1:8','#D85A30');lR2.position.set(0,4.5,0);scene.add(lR2)
        camera.position.set(2,3,6);scene.userData.animate=()=>{lR2.visible=Math.min(1,(t%loopLen)/360)>0.6}
        break
      }

      case 'sphere_volume': {
        // M057: 구의 부피 — 반투명 구 + 원기둥 비교
        const sphere57=new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.2}))
        sphere57.position.set(-2,1.5,0);scene.add(sphere57)
        const sphereW=new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15,wireframe:true}))
        sphereW.position.set(-2,1.5,0);scene.add(sphereW)
        // 원기둥
        const cyl57=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,3,32),new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.1}))
        cyl57.position.set(2,1.5,0);scene.add(cyl57)
        const cylW=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,3,32),new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.15,wireframe:true}))
        cylW.position.set(2,1.5,0);scene.add(cylW)
        const l57a=makeLabel('구 V=⁴⁄₃πr³','#534AB7',0.2);l57a.position.set(-2,3.5,0);scene.add(l57a)
        const l57b=makeLabel('원기둥 V=πr²h','#1D9E75',0.2);l57b.position.set(2,3.5,0);scene.add(l57b)
        const l57r=makeLabel('구 = 원기둥의 ⅔','#D85A30');l57r.position.set(0,4.5,0);scene.add(l57r)
        camera.position.set(0,3,7);scene.userData.animate=()=>{l57r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'sphere_surface': {
        // M058: 구의 겉넓이 — 구 + 원 4개
        const sphere58=new THREE.Mesh(new THREE.SphereGeometry(1.2,32,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15}))
        sphere58.position.set(-2,1.5,0);scene.add(sphere58)
        const sW58=new THREE.Mesh(new THREE.SphereGeometry(1.2,32,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.2,wireframe:true}))
        sW58.position.set(-2,1.5,0);scene.add(sW58)
        // 원 4개
        for(let i=0;i<4;i++){const circle=new THREE.Mesh(new THREE.RingGeometry(0,0.8,32),new THREE.MeshPhongMaterial({color:[VIO,GRN,ORG,VIO][i],transparent:true,opacity:0.3,side:THREE.DoubleSide}))
          circle.position.set(1.5+(i%2)*1.8,0.8+Math.floor(i/2)*1.8,0);scene.add(circle)
          const lb=makeLabel(`πr²`,[`#534AB7`,`#1D9E75`,`#D85A30`,`#534AB7`][i],0.12);lb.position.set(1.5+(i%2)*1.8,0.8+Math.floor(i/2)*1.8+1,0);scene.add(lb)}
        const l58r=makeLabel('겉넓이 = 4πr²','#D85A30');l58r.position.set(0,4.5,0);scene.add(l58r)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l58r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'cylinder_surface': {
        // M059: 원기둥 겉넓이 — 옆면→직사각형 펼치기
        const cyl59=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,32,1,true),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.2,side:THREE.DoubleSide}))
        cyl59.position.set(-2,1,0);scene.add(cyl59)
        const cylW59=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15,wireframe:true}))
        cylW59.position.set(-2,1,0);scene.add(cylW59)
        // 펼친 직사각형 (2πr × h)
        const rect59=addBox(2,1,0,Math.PI*2*0.5,2,0.05,GRN,0.3)
        const l59a=makeLabel('옆면','#534AB7',0.2);l59a.position.set(-2,2.5,0);scene.add(l59a)
        const l59b=makeLabel('→ 직사각형 (2πr × h)','#1D9E75',0.2);l59b.position.set(2,2.5,0);scene.add(l59b)
        const l59r=makeLabel('겉넓이 = 2πrh + 2πr²','#D85A30');l59r.position.set(0,4,0);scene.add(l59r)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l59r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'cone_volume': {
        // M060: 원뿔 부피 — 원뿔 3개 = 원기둥
        const cone1=new THREE.Mesh(new THREE.ConeGeometry(1,2,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.3}))
        cone1.position.set(-2.5,1,0);scene.add(cone1)
        const cone2=new THREE.Mesh(new THREE.ConeGeometry(1,2,32),new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.3}))
        cone2.position.set(-0.5,1,0);scene.add(cone2)
        const cone3=new THREE.Mesh(new THREE.ConeGeometry(1,2,32),new THREE.MeshPhongMaterial({color:ORG,transparent:true,opacity:0.3}))
        cone3.position.set(1.5,1,0);scene.add(cone3)
        // = 원기둥
        const cyl60=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,32),new THREE.MeshPhongMaterial({color:WHT,transparent:true,opacity:0.1,wireframe:true}))
        cyl60.position.set(4,1,0);scene.add(cyl60)
        const l60a=makeLabel('×3','#ffffff',0.3);l60a.position.set(-0.5,2.8,0);scene.add(l60a)
        const l60b=makeLabel('=','#ffffff',0.3);l60b.position.set(2.8,1,0);scene.add(l60b)
        const l60r=makeLabel('원뿔 = 원기둥의 ⅓','#D85A30');l60r.position.set(1,4,0);scene.add(l60r)
        camera.position.set(1,2,7);scene.userData.animate=()=>{l60r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      case 'cone_surface': {
        // M061: 원뿔 겉넓이 — 옆면→부채꼴
        const cone61=new THREE.Mesh(new THREE.ConeGeometry(1,2.5,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.2}))
        cone61.position.set(-2,1.25,0);scene.add(cone61)
        const coneW61=new THREE.Mesh(new THREE.ConeGeometry(1,2.5,32),new THREE.MeshPhongMaterial({color:VIO,transparent:true,opacity:0.15,wireframe:true}))
        coneW61.position.set(-2,1.25,0);scene.add(coneW61)
        // 부채꼴 (옆면 펼침)
        const sectorGeo=new THREE.RingGeometry(0,2,32,1,0,Math.PI*0.8)
        const sector61=new THREE.Mesh(sectorGeo,new THREE.MeshPhongMaterial({color:GRN,transparent:true,opacity:0.3,side:THREE.DoubleSide}))
        sector61.position.set(2,1.5,0);scene.add(sector61)
        const l61a=makeLabel('옆면','#534AB7',0.2);l61a.position.set(-2,3,0);scene.add(l61a)
        const l61b=makeLabel('→ 부채꼴 (πrl)','#1D9E75',0.2);l61b.position.set(2,3.5,0);scene.add(l61b)
        const l61r=makeLabel('겉넓이 = πrl + πr²','#D85A30');l61r.position.set(0,4.5,0);scene.add(l61r)
        camera.position.set(0,2,7);scene.userData.animate=()=>{l61r.visible=Math.min(1,(t%loopLen)/360)>0.5}
        break
      }

      default: {
        addBox(0, 0.5, 0, 1, 1, 1, VIO, 0.5)
        const lb = makeLabel(visualType.replace(/_/g, ' '), '#534AB7'); lb.position.set(0, 2, 0); scene.add(lb)
        scene.userData.animate = () => {}
      }
    }

    // 렌더 루프
    const animate = () => {
      t++
      // 카메라 공전
      const angle = t * 0.003
      const radius = 7
      camera.position.x = Math.cos(angle) * radius
      camera.position.z = Math.sin(angle) * radius
      camera.position.y = 3 + Math.sin(t * 0.005) * 0.5
      camera.lookAt(0, 0.5, 0)

      scene.userData.animate?.()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    cleanupRef.current = () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose()
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material
          if (Array.isArray(mat)) mat.forEach(m => m.dispose())
          else (mat as THREE.Material).dispose()
        }
      })
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }

    return () => { cleanupRef.current?.() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualType, JSON.stringify(values), height])

  return <div ref={containerRef} role="img" aria-label={`${visualType} 3D 시각화`} style={{ width: '100%', height, borderRadius: '12px', overflow: 'hidden' }} />
}
