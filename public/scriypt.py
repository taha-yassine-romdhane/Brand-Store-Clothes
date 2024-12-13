from PIL import Image
import os

def compress_images(input_folder, output_folder, quality=70, max_width=None, max_height=None):
    """
    Compress and resize images to reduce quality and resolution.

    Parameters:
    - input_folder: Folder containing the input images.
    - output_folder: Folder to save the compressed images.
    - quality: Quality of the output images (1-100).
    - max_width: Maximum width of the images (optional).
    - max_height: Maximum height of the images (optional).
    """
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Iterate over all images in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)

            try:
                with Image.open(input_path) as img:
                    # Resize if max_width or max_height is set
                    if max_width or max_height:
                        img.thumbnail((max_width or img.width, max_height or img.height))

                    # Save with reduced quality
                    img.save(output_path, optimize=True, quality=quality)
                    print(f"Compressed and saved: {output_path}")
            except Exception as e:
                print(f"Failed to process {input_path}: {e}")

# Example usage
input_folder = "images/product6-white-Emna"  # Path to the folder containing input images
output_folder = "images/product6-white-Emna/compressed"  # Path to the folder for saving output images
compress_images(input_folder, output_folder, quality=50, max_width=1024, max_height=768)
