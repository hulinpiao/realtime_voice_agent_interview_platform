import React from 'react'
import { cn, getTechLogos } from '@/lib/utils';
import Image from 'next/image';

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

    return (
    <div className="flex flex-row">
        {techIcons.slice(0,3).map(({ tech, url }, index) => (
            <div 
                key={tech} 
                className={cn(
                    "relative group bg-dark-300 rounded-full p-2 flex-center outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    index >= 1 && 'ml'
                )}
                tabIndex={0}
                role="img"
                aria-label={tech}
                >
                
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-dark-300 px-2 py-1 text-xs text-light-200 opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-1 group-focus:opacity-100 group-focus:-translate-y-1">
                    {tech}
                </span>
                <Image
                    src={url}
                    alt={tech}
                    width={100}
                    height={100}
                    className="size-5"
                />
            </div>
        ))}
    </div>
  )
}

export default DisplayTechIcons