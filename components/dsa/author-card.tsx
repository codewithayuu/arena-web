import React from "react";
import Image from "next/image";

interface AuthorCardProps {
  name?: string;
  role?: string;
  image?: string;
  linkedin?: string;
  youtube?: string;
  newsletter?: string;
  bio1?: string;
  bio2?: string;
}

export function AuthorCard({
  name = "Ashish Pratap Singh",
  role = "Software Engineer · Educator · Creator (ex-Amazon, Adobe)",
  image = "/images/author-ashish.avif",
  linkedin = "https://www.linkedin.com/in/ashishps1/",
  youtube = "https://www.youtube.com/@ashishps_1/videos",
  newsletter = "https://blog.mindflare.tech/",
  bio1 = "Hi, I’m Ashish, the creator of mindflare.tech. I built Mindflare to make coding interview preparation more structured, practical, and enjoyable. A strong foundation in DSA helped me clear interviews at companies including Amazon, Google, and Microsoft.",
  bio2 = "After solving thousands of problems and going through numerous technical interviews, I created this course to share the most important patterns, preparation strategies, and lessons I learned along the way.",
}: AuthorCardProps) {
  return (
    <div className="my-10 p-5 sm:p-6 rounded-xl border border-border bg-muted/10 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-md flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{role}</p>
          <div className="flex items-center gap-2 pt-1 text-xs text-primary">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold"
              >
                LinkedIn
              </a>
            )}
            {youtube && (
              <>
                <span>·</span>
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-semibold"
                >
                  YouTube
                </a>
              </>
            )}
            {newsletter && (
              <>
                <span>·</span>
                <a
                  href={newsletter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-semibold"
                >
                  Newsletter
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40 space-y-2">
        <p>{bio1}</p>
        {bio2 && <p>{bio2}</p>}
      </div>
    </div>
  );
}
