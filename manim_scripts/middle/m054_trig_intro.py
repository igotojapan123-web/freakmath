from manim import *

class TrigIntro(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        title = Text("삼각비의 정의", font_size=40, color=WHITE).to_edge(UP, buff=0.4)
        self.play(Write(title))

        # ── 씬 1: 직각삼각형 ──
        A2 = ORIGIN + DOWN*1.5 + LEFT*2.5
        B2 = A2 + RIGHT*4
        C2 = B2 + UP*3

        tri = Polygon(A2, B2, C2, color=WHITE, stroke_width=3)

        sq_sz = 0.22
        right_sq = Square(side_length=sq_sz, color=WHITE, stroke_width=1.5)
        right_sq.move_to(B2 + LEFT*sq_sz/2 + UP*sq_sz/2)

        self.play(Create(tri), Create(right_sq), run_time=1.2)

        # 레이블
        a_lbl = MathTex("a", font_size=34, color=MINT).next_to((B2+C2)/2, RIGHT, buff=0.25)
        b_lbl = MathTex("b", font_size=34, color=PURPLE).next_to((A2+B2)/2, DOWN, buff=0.25)
        c_lbl = MathTex("c", font_size=34, color=AMBER).next_to((A2+C2)/2, LEFT, buff=0.25)
        angle_lbl = MathTex("A", font_size=34, color=WHITE).next_to(A2, UR, buff=0.15)

        self.play(
            Write(a_lbl), Write(b_lbl), Write(c_lbl), Write(angle_lbl),
            run_time=0.8
        )
        self.wait(0.5)

        # ── 씬 2: 세 가지 삼각비 순차 등장 ──
        trig_defs = VGroup(
            MathTex("\\sin A = \\frac{\\text{대변}}{\\text{빗변}} = \\frac{a}{c}", font_size=36, color=MINT),
            MathTex("\\cos A = \\frac{\\text{밑변}}{\\text{빗변}} = \\frac{b}{c}", font_size=36, color=PURPLE),
            MathTex("\\tan A = \\frac{\\text{대변}}{\\text{밑변}} = \\frac{a}{b}", font_size=36, color=AMBER),
        ).arrange(DOWN, buff=0.45).to_edge(RIGHT, buff=0.5)

        for i, defn in enumerate(trig_defs):
            if i == 0:
                highlight = Line(B2, C2, color=MINT, stroke_width=5)
            elif i == 1:
                highlight = Line(A2, B2, color=PURPLE, stroke_width=5)
            else:
                highlight = VGroup(
                    Line(B2, C2, color=AMBER, stroke_width=5),
                    Line(A2, B2, color=AMBER, stroke_width=5)
                )

            self.play(
                Create(highlight),
                Write(defn),
                run_time=0.8
            )
            self.wait(0.4)

        # ── 씬 3: SOH-CAH-TOA 암기법 ──
        self.wait(0.5)
        memory = Text("SOH - CAH - TOA", font_size=36, color=AMBER, weight=BOLD)
        memory.to_edge(DOWN, buff=0.8)
        self.play(Write(memory), run_time=1)

        sub = Text("Sin=Opp/Hyp · Cos=Adj/Hyp · Tan=Opp/Adj", font_size=20, color=WHITE)
        sub.next_to(memory, UP, buff=0.3)
        self.play(FadeIn(sub), run_time=0.8)

        self.play(Indicate(memory, color=AMBER, scale_factor=1.1), run_time=1)
        self.wait(2)
