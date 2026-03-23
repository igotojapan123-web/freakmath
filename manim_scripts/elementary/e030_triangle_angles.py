from manim import *

class TriangleAngles(Scene):
    def construct(self):
        self.camera.background_color = "#000008"
        MINT = "#00ffcc"
        PURPLE = "#a78bfa"
        AMBER = "#fbbf24"

        title = Text("삼각형의 내각의 합", font_size=36, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title))

        # ── 씬 1: 삼각형 ──
        tri = Triangle(color=MINT, stroke_width=3)
        tri.set_fill(MINT, opacity=0.1)
        tri.scale(2.5).move_to(ORIGIN + DOWN*0.3)
        self.play(Create(tri), run_time=1.2)

        # 각 레이블
        angle_a = MathTex("A", color=AMBER, font_size=36).next_to(tri.get_vertices()[0], UP, buff=0.2)
        angle_b = MathTex("B", color=PURPLE, font_size=36).next_to(tri.get_vertices()[1], DL, buff=0.2)
        angle_c = MathTex("C", color=MINT, font_size=36).next_to(tri.get_vertices()[2], DR, buff=0.2)

        self.play(Write(angle_a), Write(angle_b), Write(angle_c), run_time=0.8)
        self.wait(0.5)

        # ── 씬 2: 각을 떼어내서 직선으로 ──
        self.play(FadeOut(tri, angle_a, angle_b, angle_c))

        # 직선 위에 세 각을 나란히
        line = Line(LEFT*3, RIGHT*3, color=WHITE, stroke_width=2)
        self.play(Create(line), run_time=0.8)

        arc_a = Arc(radius=0.8, start_angle=0, angle=PI/3, color=AMBER, stroke_width=4)
        arc_a.move_to(LEFT*1.8 + DOWN*0.01)

        arc_b = Arc(radius=0.8, start_angle=PI/3, angle=PI/2, color=PURPLE, stroke_width=4)
        arc_b.move_to(ORIGIN + DOWN*0.01)

        arc_c = Arc(radius=0.8, start_angle=PI/3+PI/2, angle=PI/6, color=MINT, stroke_width=4)
        arc_c.move_to(RIGHT*1.5 + DOWN*0.01)

        self.play(
            Create(arc_a), Create(arc_b), Create(arc_c),
            run_time=1.5
        )

        reveal = Text("세 각을 모으면 정확히 직선(180°)!", font_size=22, color=AMBER)
        reveal.to_edge(DOWN, buff=1.5)
        self.play(Write(reveal), run_time=0.8)
        self.wait(0.5)

        # ── 씬 3: 공식 ──
        formula = MathTex(
            "A + B + C = 180°",
            font_size=56, color=MINT
        )
        formula.to_edge(DOWN, buff=0.8)

        self.play(
            FadeOut(reveal),
            Write(formula),
            run_time=1.5
        )
        self.play(Indicate(formula, color=MINT, scale_factor=1.1), run_time=1)
        self.wait(1.5)
