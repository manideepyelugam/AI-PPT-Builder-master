import React from "react";

export function BlankCardIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-2 w-3/4 rounded bg-white" />
    </div>
  );
}

export function ImageAndTextIcon() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="w-1/2 rounded bg-white" />
      <div className="flex w-1/2 flex-col gap-1">
        <div className="h-2 w-full rounded bg-white" />
        <div className="h-2 w-2/3 rounded bg-white" />
      </div>
    </div>
  );
}

export function TextAndImageIcon() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="flex w-1/2 flex-col gap-1">
        <div className="h-2 w-full rounded bg-white" />
        <div className="h-2 w-2/3 rounded bg-white" />
      </div>
      <div className="w-1/2 rounded bg-white" />
    </div>
  );
}

export function TwoColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-4 w-full rounded bg-white" />
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreeColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-4 w-full rounded bg-white" />
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FourColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-4 w-full rounded bg-white" />
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-2 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoColumnsWithHeadingsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-4 w-full rounded bg-white" />
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreeColumnsWithHeadingsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-4 w-full rounded bg-white" />
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BulletsIcon() {
  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="mb-1 h-3 w-3/4 rounded bg-gray-300" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-white" />
          <div className="h-2 flex-1 rounded bg-white" />
        </div>
      ))}
    </div>
  );
}

export function TwoImageColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="h-3 w-full rounded bg-white" />
      <div className="flex h-8 w-full items-center justify-center rounded bg-white"></div>
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreeImageColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="h-3 w-full rounded bg-white" />
      <div className="flex h-8 w-full items-center justify-center rounded bg-white"></div>
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="h-1 w-1/4 rounded bg-white opacity-60" />
      <div className="h-4 w-3/4 rounded bg-white" />
      <div className="h-2 w-2/3 rounded bg-white opacity-80" />
    </div>
  );
}

export function SectionDividerIcon() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-2 pl-2">
      <div className="h-2 w-6 rounded bg-white opacity-50" />
      <div className="h-4 w-3/4 rounded bg-white" />
    </div>
  );
}

export function QuoteIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="text-2xl leading-none text-white">&ldquo;</div>
      <div className="h-2 w-3/4 rounded bg-white" />
      <div className="h-2 w-2/3 rounded bg-white" />
      <div className="h-1 w-1/3 rounded bg-white opacity-60" />
    </div>
  );
}

export function StatsIcon() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="h-2 w-1/2 rounded bg-white opacity-60" />
      <div className="flex w-full justify-between gap-2 px-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-3 w-6 rounded bg-white" />
            <div className="h-1 w-5 rounded bg-white opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FullImageIcon() {
  return (
    <div className="relative flex h-full w-full items-end justify-start overflow-hidden rounded bg-white/80 p-1">
      <div className="h-2 w-2/3 rounded bg-white" />
    </div>
  );
}

export function TitleBodyIcon() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-2 px-2">
      <div className="h-3 w-3/4 rounded bg-white" />
      <div className="h-1 w-full rounded bg-white opacity-80" />
      <div className="h-1 w-full rounded bg-white opacity-80" />
      <div className="h-1 w-2/3 rounded bg-white opacity-80" />
    </div>
  );
}

export function TableIcon() {
  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-1">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="rounded bg-white" />
      ))}
    </div>
  );
}

export function FourImageColumnsIcon() {
  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="h-3 w-full rounded bg-white" />
      <div className="flex h-8 w-full items-center justify-center rounded bg-white"></div>
      <div className="flex h-full w-full gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="flex w-1/2 flex-col gap-1" key={i}>
            <div className="h-2 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-full rounded bg-white" />
            <div className="h-1 w-2/3 rounded bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}
