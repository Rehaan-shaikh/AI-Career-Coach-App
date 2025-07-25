import Image from "next/image";
import { cn } from "@/lib/utils";
import { getTechLogos } from "@/lib/data";

export const DisplayTechIcons = async ({ techStack = [] }) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row items-center">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-900 bg-neutral-800 flex items-center justify-center",
            index > 0 && "-ml-3"
          )}
        >
          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="w-4 h-4 object-contain"
          />
        </div>
      ))}
    </div>
  );
};
