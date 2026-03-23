from manim import *

class Percentage(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        AMBER = "#fbbf24"

        title = Text("백분율", font_size=36, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title))

        # ── 씬 1: 직사각형 100칸 ──
        grid = VGroup()
        n_filled = 30

        for i in range(10):
            for j in range(10):
                idx = i*10 + j
                sq = Square(
                    side_length=0.3,
                    color=MINT if idx < n_filled else WHITE,
                    fill_color=MINT if idx < n_filled else ORIGIN,
                    fill_opacity=0.7 if idx < n_filled else 0,
                    stroke_width=0.5,
                    stroke_opacity=0.3
                )
                sq.move_to(LEFT*1.4 + RIGHT*j*0.32 + UP*1.4 + DOWN*i*0.32)
                grid.add(sq)

        self.play(FadeIn(grid), run_time=1.5)

        # 30% 레이블
        label_30 = Text("30%", font_size=48, color=MINT)
        label_30.move_to(RIGHT*2.5)
        self.play(Write(label_30), run_time=0.8)
        self.wait(0.5)

        # ── 씬 2: 공식 ──
        self.play(FadeOut(grid, label_30))

        formula = MathTex(
            "\\%", "=",
            "\\frac{\\text{부분}}{\\text{전체}}", "\\times", "100",
            font_size=52
        )
        formula.set_color_by_tex("\\%", MINT)
        formula.set_color_by_tex("\\frac{\\text{부분}}{\\text{전체}}", AMBER)
        formula.move_to(ORIGIN)

        self.play(Write(formula), run_time=1.5)

        # 예시
        example = MathTex(
            "30 \\div 100 \\times 100 = 30\\%",
            font_size=36, color=AMBER
        )
        example.to_edge(DOWN, buff=1)
        self.play(Write(example), run_time=1)

        self.play(Indicate(formula, color=MINT), run_time=1)
        self.wait(1.5)
