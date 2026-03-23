from manim import *

class CircleArea(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        AMBER = "#fbbf24"

        title = Text("원의 넓이", font_size=36, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title))

        # ── 씬 1: 원 등장 ──
        circle = Circle(radius=2, color=MINT, stroke_width=3)
        circle.set_fill(MINT, opacity=0.1)
        self.play(Create(circle), run_time=1.5)

        # 반지름 선
        radius_line = Line(ORIGIN, RIGHT*2, color=AMBER, stroke_width=3)
        r_label = MathTex("r", color=AMBER, font_size=36).next_to(radius_line, DOWN, buff=0.15)
        self.play(Create(radius_line), Write(r_label), run_time=0.8)

        # ── 씬 2: 조각으로 나누기 ──
        self.wait(0.5)
        self.play(FadeOut(radius_line, r_label))

        # 부채꼴 8개
        sectors = VGroup()
        n = 8
        for i in range(n):
            sector = Sector(
                outer_radius=2,
                start_angle=TAU * i / n,
                angle=TAU / n,
                color=MINT if i % 2 == 0 else AMBER,
                fill_opacity=0.6,
                stroke_width=1,
                stroke_color=WHITE,
                stroke_opacity=0.3,
            )
            sectors.add(sector)

        self.play(FadeOut(circle), FadeIn(sectors), run_time=1)
        self.wait(0.5)

        # ── 씬 3: 재배열 → 평행사변형 ──
        rearranged = VGroup()
        for i in range(n):
            s = sectors[i].copy()
            if i % 2 == 0:
                s.move_to(RIGHT * (i//2 * 0.8 - 1.6) + DOWN * 1.5)
            else:
                s.rotate(PI)
                s.move_to(RIGHT * (i//2 * 0.8 - 1.2) + DOWN * 1.5)
            rearranged.add(s)

        self.play(Transform(sectors, rearranged), run_time=2)

        approach_text = Text("점점 직사각형에 가까워져!", font_size=22, color=AMBER)
        approach_text.to_edge(DOWN, buff=0.3)
        self.play(Write(approach_text), run_time=0.8)
        self.wait(0.5)

        # ── 씬 4: 공식 도출 ──
        self.play(FadeOut(sectors, approach_text))

        derivation = VGroup(
            Text("밑변 ≈ πr  (원주의 절반)", font_size=22, color=WHITE),
            Text("높이 ≈ r", font_size=22, color=WHITE),
            MathTex("\\therefore A = \\pi r \\times r = \\pi r^2", font_size=44, color=MINT),
        ).arrange(DOWN, buff=0.4).move_to(ORIGIN)

        self.play(LaggedStartMap(Write, derivation, lag_ratio=0.5), run_time=2)

        # 최종 강조
        self.play(
            Indicate(derivation[2], color=MINT, scale_factor=1.15),
            run_time=1
        )
        self.wait(1.5)
