interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export function MultiImageGrid({
  images,
  onClickImage,
}: {
  images: Media[];
  onClickImage: (idx: number) => void;
}) {
  const extraCount = images.length > 2 ? images.length - 2 : 0;

  return (
    <div className="flex w-full gap-[11px] md:gap-[20px]">
      <div
        className="relative h-[160px] w-[60%] shrink-0 cursor-pointer overflow-hidden rounded-[22px] md:h-[356px] md:w-[518px]"
        onClick={() => onClickImage(0)}
      >
        <img src={images[0]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-[10px] md:gap-[20px]">
        <div
          className="relative h-[75px] cursor-pointer overflow-hidden rounded-[22px] md:h-[168px]"
          onClick={() => onClickImage(1)}
        >
          <img
            src={images[1]?.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {extraCount > 0 && (
          <div
            className="relative h-[75px] cursor-pointer overflow-hidden rounded-[22px] md:h-[168px]"
            onClick={() => onClickImage(2)}
          >
            <img
              src={images[2]?.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="text-center text-[12px] font-normal text-foreground md:text-[20px]">
                +{String(extraCount).padStart(2, '0')}
                <br />
                More
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
