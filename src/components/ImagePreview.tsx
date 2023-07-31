// components/ImagePreview.tsx
import React from "react";
import Image from "next/image";

type Props = {
    image: File;
};

const ImagePreview = ({ image }: Props) => {
    return (
        <div>
            <div className="grid grid-cols-12 gap-2 my-2">
                {
                    <div className="relative aspect-video col-span-4" key={image.name}>

                        <Image src={URL.createObjectURL(image)} alt={image.name} className="object-cover" height={100} width={100} />
                    </div>
                }
            </div>
        </div>
    );
};

export default ImagePreview;
