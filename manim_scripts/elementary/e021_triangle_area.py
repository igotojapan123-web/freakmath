from manim import *

class TriangleArea(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        # ── 씬 1: 직사각형 먼저 ──
        title = Text("삼각형의 넓이", font_size=36, color=WHITE)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))

        rect = Rectangle(width=4, height=2.5, color=WHITE, stroke_opacity=0.4)
        rect.set_fill(WHITE, opacity=0.05)
        rect_label = MathTex("\\text{넓이} = b \\times h", font_size=28, color=WHITE)
        rect_label.next_to(rect, DOWN, buff=0.3)

        self.play(FadeIn(rect), Write(rect_label), run_time=1)

        # ── 씬 2: 대각선으로 자르기 ──
        self.wait(0.5)
        diag = Line(rect.get_corner(DL), rect.get_corner(UR), color=MINT, stroke_width=3)
        self.play(Create(diag), run_time=1)

        # 두 삼각형 강조
        tri1 = Polygon(
            rect.get_corner(DL), rect.get_corner(DR), rect.get_corner(UR),
            color=MINT, fill_color=MINT, fill_opacity=0.2, stroke_width=2
        )
        tri2 = Polygon(
            rect.get_corner(DL), rect.get_corner(UL), rect.get_corner(UR),
            color=PURPLE, fill_color=PURPLE, fill_opacity=0.2, stroke_width=2
        )
        self.play(FadeIn(tri1), FadeIn(tri2), run_time=1)

        equal_text = Text("두 삼각형의 넓이는 같아!", font_size=22, color=AMBER)
        equal_text.to_edge(DOWN, buff=1.5)
        self.play(Write(equal_text), run_time=0.8)
        self.wait(0.5)

        # ── 씬 3: 절반이라는 것 강조 ──
        self.play(FadeOut(tri2, rect, rect_label, diag, equal_text))

        half_text = MathTex("\\therefore", "\\text{삼각형 넓이}", "=", "\\frac{1}{2}", "\\times", "b \\times h", font_size=44)
        half_text.set_color_by_tex("\\frac{1}{2}", AMBER)
        half_text.set_color_by_tex("b \\times h", MINT)
        half_text.move_to(ORIGIN)

        self.play(
            tri1.animate.move_to(UP*0.5),
            run_time=0.8
        )
        self.play(Write(half_text), run_time=1.5)

        # 최종 공식
        self.wait(0.5)
        final = MathTex("A = \\frac{1}{2} b h", font_size=64, color=MINT)
        final.to_edge(DOWN, buff=0.8)

        self.play(
            Transform(half_text, final),
            Indicate(tri1, color=MINT),
            run_time=1.5
        )
        self.wait(1.5)
