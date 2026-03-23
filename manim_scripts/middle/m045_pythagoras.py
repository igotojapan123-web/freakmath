from manim import *

class PythagorasProof(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        # ── 씬 1: 피타고라스 삼각형 ──
        title = Text("피타고라스의 정리", font_size=40, color=WHITE)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1)

        a, b = 3.0, 4.0
        c = (a**2 + b**2)**0.5

        A = ORIGIN + DOWN*1.5 + LEFT*2
        B = A + RIGHT*(b*0.8)
        C = A + UP*(a*0.8)

        tri = Polygon(A, B, C, color=WHITE, stroke_width=3)
        tri.set_fill(WHITE, opacity=0.05)

        self.play(Create(tri), run_time=1.5)

        # 직각 표시
        sq_size = 0.2
        right_angle = Square(side_length=sq_size, color=WHITE, stroke_width=1.5)
        right_angle.move_to(A + RIGHT*sq_size/2 + UP*sq_size/2)
        self.play(Create(right_angle), run_time=0.5)

        # 변수 레이블
        a_lbl = MathTex("a", font_size=36, color=MINT).next_to(
            (A+C)/2, LEFT, buff=0.3)
        b_lbl = MathTex("b", font_size=36, color=PURPLE).next_to(
            (A+B)/2, DOWN, buff=0.3)
        c_lbl = MathTex("c", font_size=36, color=AMBER).next_to(
            (B+C)/2, RIGHT+UP*0.3, buff=0.15)

        self.play(
            Write(a_lbl), Write(b_lbl), Write(c_lbl),
            run_time=1
        )
        self.wait(0.5)

        # ── 씬 2: 정사각형 펼치기 ──
        sq_a = Square(side_length=a*0.8, color=MINT, stroke_width=2)
        sq_a.set_fill(MINT, opacity=0.15)
        sq_a.move_to(A + LEFT*a*0.4 + UP*a*0.4)

        sq_b = Square(side_length=b*0.8, color=PURPLE, stroke_width=2)
        sq_b.set_fill(PURPLE, opacity=0.15)
        sq_b.move_to(A + RIGHT*b*0.4 + DOWN*b*0.4)

        self.play(
            GrowFromPoint(sq_a, A),
            GrowFromPoint(sq_b, A),
            run_time=1.5
        )

        a2_lbl = MathTex("a^2", font_size=32, color=MINT).move_to(sq_a)
        b2_lbl = MathTex("b^2", font_size=32, color=PURPLE).move_to(sq_b)
        self.play(Write(a2_lbl), Write(b2_lbl), run_time=0.8)

        # c²
        hyp_angle = np.arctan2(C[1]-B[1], C[0]-B[0])
        sq_c = Square(side_length=c*0.8*0.72, color=AMBER, stroke_width=2)
        sq_c.set_fill(AMBER, opacity=0.15)
        sq_c.rotate(hyp_angle)
        sq_c.move_to((B+C)/2 + RIGHT*0.6)

        self.play(GrowFromPoint(sq_c, (B+C)/2), run_time=1.5)
        c2_lbl = MathTex("c^2", font_size=32, color=AMBER).move_to(sq_c)
        self.play(Write(c2_lbl), run_time=0.8)

        self.wait(0.5)

        # ── 씬 3: 공식 도출 ──
        formula = MathTex(
            "a^2", "+", "b^2", "=", "c^2",
            font_size=64
        )
        formula[0].set_color(MINT)
        formula[2].set_color(PURPLE)
        formula[4].set_color(AMBER)
        formula.to_edge(DOWN, buff=0.8)

        self.play(Write(formula), run_time=1.5)
        self.play(Flash(formula, color=MINT, flash_radius=1.5), run_time=1)
        self.wait(1.5)

        # ── 씬 4: 숫자 예시 (3,4,5) ──
        self.play(FadeOut(sq_a, sq_b, sq_c, a2_lbl, b2_lbl, c2_lbl, right_angle))

        example = MathTex(
            "3^2 + 4^2 = 5^2",
            "\\quad\\Rightarrow\\quad",
            "9 + 16 = 25",
            font_size=40, color=AMBER
        )
        example.next_to(formula, UP, buff=0.5)
        self.play(Write(example), run_time=1.5)

        self.play(Indicate(formula, color=MINT, scale_factor=1.15), run_time=1)
        self.wait(2)
