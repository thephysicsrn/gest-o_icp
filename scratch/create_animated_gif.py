import math
import os
from PIL import Image, ImageDraw

def create_scientist_gif():
    input_path = "public/cientista-ilustracao-1.jpg"
    output_path = "public/cientista-animada.gif"

    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return

    # Resize base image to 550x550 for optimal file size and crisp web display
    raw_img = Image.open(input_path).convert("RGBA")
    target_size = (550, 550)
    base_img = raw_img.resize(target_size, Image.Resampling.LANCZOS)
    w, h = base_img.size

    frames = []
    total_frames = 24  # smooth loop

    # Center coordinates relative to 550x550
    cx_book = w * 0.62
    cy_book = h * 0.38
    
    cx_head = w * 0.52
    cy_head = h * 0.18

    for i in range(total_frames):
        t = i / total_frames
        angle = t * 2 * math.pi

        # 1. Subtle natural vertical breathing/floating (up/down ~5 pixels)
        dy = int(math.sin(angle) * 5)
        dx = int(math.cos(angle) * 1.5)

        # Create canvas with pure white background
        frame = Image.new("RGBA", (w, h), (255, 255, 255, 255))
        
        # Paste shifted image for subtle floating
        temp_img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
        temp_img.paste(base_img, (dx, dy))
        frame.paste(temp_img, (0, 0))

        # Overlay glowing animated effects
        overlay = Image.new("RGBA", (w, h), (255, 255, 255, 0))
        draw = ImageDraw.Draw(overlay)

        # 2. Orbiting green/blue scientific atom particles around the notebook
        num_particles = 5
        for p in range(num_particles):
            p_angle = angle + (p * 2 * math.pi / num_particles)
            rx = 55 + 10 * math.sin(angle * 2 + p)
            ry = 28 + 6 * math.cos(angle * 2 + p)
            tilt = -0.3  # tilt the orbit

            px = cx_book + rx * math.cos(p_angle) * math.cos(tilt) - ry * math.sin(p_angle) * math.sin(tilt) + dx
            py = cy_book + rx * math.cos(p_angle) * math.sin(tilt) + ry * math.sin(p_angle) * math.cos(tilt) + dy

            # Particle size
            size = int(3 + 2 * math.sin(p_angle))
            alpha = int(190 + 60 * math.sin(p_angle))

            if p % 2 == 0:
                color = (112, 179, 45, alpha) # SESI Green
            else:
                color = (0, 43, 92, alpha)    # SESI Navy Blue

            draw.ellipse([px - size, py - size, px + size, py + size], fill=color)
            
            # Tiny sparkle trail
            sp_x = px - 4 * math.cos(p_angle)
            sp_y = py - 4 * math.sin(p_angle)
            draw.ellipse([sp_x - 1, sp_y - 1, sp_x + 1, sp_y + 1], fill=(134, 214, 54, int(alpha * 0.7)))

        # 3. Soft twinkling star from the pen
        twinkle_t = (math.sin(angle * 3) + 1) / 2
        tw_size = int(2 + twinkle_t * 4)
        pen_x = cx_book - 35 + dx
        pen_y = cy_book - 18 + dy
        draw.ellipse([pen_x - tw_size, pen_y - tw_size, pen_x + tw_size, pen_y + tw_size], fill=(112, 179, 45, int(180 * twinkle_t)))
        
        # 4. Goggles subtle lens gleam
        glint_x = cx_head + math.sin(angle) * 20 + dx
        glint_y = cy_head - 15 + dy
        glint_w = 4
        draw.ellipse([glint_x - glint_w, glint_y - 2, glint_x + glint_w, glint_y + 2], fill=(255, 255, 255, int(200 * abs(math.cos(angle)))))

        # Composite overlay
        combined = Image.alpha_composite(frame, overlay)
        
        # Convert with adaptive palette for crisp small GIF
        final_frame = combined.convert("RGB").quantize(colors=128)
        frames.append(final_frame)

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=70,  # ~14 fps smooth loop
        loop=0,
        optimize=True
    )
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Optimized Animated GIF generated at {output_path} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    create_scientist_gif()
