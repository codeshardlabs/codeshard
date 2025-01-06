"use client";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import ShardImg from "../../../public/images/shard.png";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-dark">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Collaborative Coding
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={ShardImg}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
