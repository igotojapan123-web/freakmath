from manim import *

class RectangleArea(Scene):
    def construct(self):
        self.camera.background_color = "#000008"

        # 색상 정의
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        # ── 씬 1: 직사각형 등장 ──
        title = Text("직사각형의 넓이", font_size=36, color=WHITE)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # 직사각형
        rect = Rectangle(width=4, height=2.5, color=MINT)
        rect.set_fill(MINT, opacity=0.1)
        self.play(Create(rect), run_time=1.5)

        # 변수 레이블
        a_label = MathTex("a", color=MINT).next_to(rect, DOWN, buff=0.3)
        b_label = MathTex("b", color=PURPLE).next_to(rect, LEFT, buff=0.3)
        self.play(
            Write(a_label),
            Write(b_label),
            run_time=0.8
        )

        # ── 씬 2: 격자로 채우기 ──
        self.wait(0.5)
        grid_lines = VGroup()

        # 가로 격자선
        for i in range(1, 4):
            line = Line(
                rect.get_left() + RIGHT * i,
                rect.get_left() + RIGHT * i + UP * 2.5,
                color=MINT, stroke_width=0.5, stroke_opacity=0.4
            )
            grid_lines.add(line)

        # 세로 격자선
        for i in range(1, 3):
            line = Line(
                rect.get_bottom() + UP * i,
                rect.get_bottom() + UP * i + RIGHT * 4,
                color=MINT, stroke_width=0.5, stroke_opacity=0.4
            )
            grid_lines.add(line)

        self.play(Create(grid_lines), run_time=1.5)

        # 단위 정사각형 카운트
        count_text = Text("4 × 3 = 12개", font_size=24, color=AMBER)
        count_text.to_edge(DOWN, buff=1)
        self.play(Write(count_text), run_time=0.8)
        self.wait(0.5)

        # ── 씬 3: 공식 등장 ──
        formula_group = VGroup(
            MathTex("A", "=", "a", "\\times", "b", font_size=60)
        )
        formula_group[0].set_color_by_tex("A", WHITE)
        formula_group[0].set_color_by_tex("a", MINT)
        formula_group[0].set_color_by_tex("b", PURPLE)

        formula_group.to_edge(DOWN, buff=0.8)

        self.play(FadeOut(count_text))
        self.play(
            Write(formula_group),
            rect.animate.set_fill(MINT, opacity=0.2),
            run_time=1.5
        )

        # ── 씬 4: 숫자 예시 ──
        self.wait(0.5)
        example = MathTex(
            "A = 8 \\times 5 = 40\\text{cm}^2",
            font_size=36, color=AMBER
        )
        example.next_to(formula_group, UP, buff=0.5)
        self.play(Write(example), run_time=1)

        # 글로우 효과 (Indicate)
        self.play(
            Indicate(formula_group, color=MINT, scale_factor=1.1),
            run_time=1
        )
        self.wait(1)


if __name__ == "__main__":
    # 실행: manim -pqh e019_rectangle_area.py RectangleArea
    pass
