from manim import *

class QuadraticFormula(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        title = Text("근의 공식", font_size=40, color=WHITE).to_edge(UP, buff=0.4)
        self.play(Write(title))

        # ── 씬 1: 이차방정식 제시 ──
        eq = MathTex("ax^2 + bx + c = 0", font_size=52, color=WHITE)
        eq.move_to(UP*1.5)
        self.play(Write(eq), run_time=1.2)

        question = Text("x = ?", font_size=36, color=AMBER).next_to(eq, DOWN, buff=0.5)
        self.play(Write(question), run_time=0.8)
        self.wait(0.5)

        # ── 씬 2: 완전제곱식으로 변환 ──
        self.play(FadeOut(question))

        steps = VGroup(
            MathTex("ax^2 + bx = -c", font_size=36),
            MathTex("x^2 + \\frac{b}{a}x = -\\frac{c}{a}", font_size=36),
            MathTex("\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2-4ac}{4a^2}", font_size=36, color=MINT),
        ).arrange(DOWN, buff=0.4).move_to(DOWN*0.2)

        for step in steps:
            self.play(Write(step), run_time=0.8)
            self.wait(0.3)

        self.wait(0.5)

        # ── 씬 3: 공식 완성 ──
        self.play(FadeOut(eq, steps))

        final = MathTex(
            "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            font_size=60, color=MINT
        )
        final.move_to(ORIGIN)

        self.play(Write(final), run_time=2)
        self.play(Flash(final, color=MINT, flash_radius=2), run_time=1)

        # 판별식 설명
        discriminant = MathTex(
            "D = b^2 - 4ac",
            font_size=36, color=AMBER
        ).to_edge(DOWN, buff=1)

        self.play(Write(discriminant), run_time=1)

        d_cases = VGroup(
            Text("D > 0: 서로 다른 두 실근", font_size=22, color=WHITE),
            Text("D = 0: 중근 (같은 두 근)", font_size=22, color=MINT),
            Text("D < 0: 허근 (실수 범위에서 해 없음)", font_size=22, color=PURPLE),
        ).arrange(DOWN, buff=0.25).next_to(discriminant, UP, buff=0.4)

        self.play(LaggedStartMap(FadeIn, d_cases, lag_ratio=0.4), run_time=1.5)
        self.wait(2)
