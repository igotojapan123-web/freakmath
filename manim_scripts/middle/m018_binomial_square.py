from manim import *

class BinomialSquare(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        title = Text("곱셈 공식: (a+b)²", font_size=40, color=WHITE).to_edge(UP, buff=0.4)
        self.play(Write(title))

        # ── 씬 1: 큰 정사각형 ──
        a, b = 1.8, 1.2

        big_sq = Square(side_length=a+b, color=WHITE, stroke_width=2)
        big_sq.set_fill(WHITE, opacity=0.03)
        big_sq.move_to(ORIGIN + LEFT*0.5)
        self.play(Create(big_sq), run_time=1)

        # 분할선
        corner = big_sq.get_corner(DL)
        x_split = corner[0] + a
        y_split = corner[1] + a

        v_line = Line(
            np.array([x_split, big_sq.get_bottom()[1], 0]),
            np.array([x_split, big_sq.get_top()[1], 0]),
            color=MINT, stroke_width=1.5
        )
        h_line = Line(
            np.array([big_sq.get_left()[0], y_split, 0]),
            np.array([big_sq.get_right()[0], y_split, 0]),
            color=MINT, stroke_width=1.5
        )

        self.play(Create(v_line), Create(h_line), run_time=0.8)

        # 레이블
        a_top = MathTex("a", font_size=28, color=MINT).next_to(
            np.array([(corner[0]+x_split)/2, big_sq.get_top()[1], 0]), UP, buff=0.15)
        b_top = MathTex("b", font_size=28, color=PURPLE).next_to(
            np.array([(x_split+big_sq.get_right()[0])/2, big_sq.get_top()[1], 0]), UP, buff=0.15)
        a_side = MathTex("a", font_size=28, color=MINT).next_to(
            np.array([big_sq.get_left()[0], (y_split+big_sq.get_top()[1])/2, 0]), LEFT, buff=0.15)
        b_side = MathTex("b", font_size=28, color=PURPLE).next_to(
            np.array([big_sq.get_left()[0], (corner[1]+y_split)/2, 0]), LEFT, buff=0.15)

        self.play(Write(a_top), Write(b_top), Write(a_side), Write(b_side), run_time=0.8)

        # 4개 영역 채우기
        a2_lbl = MathTex("a^2", font_size=34, color=MINT).move_to(
            np.array([(corner[0]+x_split)/2, (y_split+big_sq.get_top()[1])/2, 0]))
        ab1_lbl = MathTex("ab", font_size=28, color=AMBER).move_to(
            np.array([(x_split+big_sq.get_right()[0])/2, (y_split+big_sq.get_top()[1])/2, 0]))
        ab2_lbl = MathTex("ab", font_size=28, color=AMBER).move_to(
            np.array([(corner[0]+x_split)/2, (corner[1]+y_split)/2, 0]))
        b2_lbl = MathTex("b^2", font_size=34, color=PURPLE).move_to(
            np.array([(x_split+big_sq.get_right()[0])/2, (corner[1]+y_split)/2, 0]))

        self.play(
            Write(a2_lbl), Write(ab1_lbl),
            Write(ab2_lbl), Write(b2_lbl),
            run_time=1
        )
        self.wait(0.5)

        # ── 씬 2: 공식 조합 ──
        formula = MathTex(
            "(a+b)^2", "=", "a^2", "+", "2ab", "+", "b^2",
            font_size=52
        )
        formula[2].set_color(MINT)
        formula[4].set_color(AMBER)
        formula[6].set_color(PURPLE)
        formula.to_edge(DOWN, buff=0.8)

        self.play(Write(formula), run_time=1.5)
        self.play(Flash(formula, color=MINT, flash_radius=1.8), run_time=1)
        self.wait(2)
