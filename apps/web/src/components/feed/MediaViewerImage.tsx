interface Props {
  src: string;
  imgKey: string;
  username?: string;
  loaded: boolean;
  onLoaded: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export function MediaViewerImage({ src, imgKey, username, loaded, onLoaded, onClick }: Props) {
  return (
    <div
      style={{ display: 'inline-grid', maxHeight: '90vh', maxWidth: '90vw', position: 'relative' }}
      onClick={onClick}
    >
      <img
        key={imgKey}
        src={src}
        alt=""
        onLoad={onLoaded}
        onError={onLoaded}
        style={{
          gridArea: '1/1',
          display: 'block',
          maxHeight: '90vh',
          maxWidth: '90vw',
          borderRadius: 8,
          objectFit: 'contain',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      {!loaded && <LoadingSpinner />}
      {username && loaded && <WatermarkLabel username={username} />}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      className="pointer-events-none flex items-center justify-center"
      style={{ gridArea: '1/1', minWidth: 240, minHeight: 240 }}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  );
}

function WatermarkLabel({ username }: { username: string }) {
  return (
    <div
      style={{
        gridArea: '1/1',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 10,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 6,
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: '6px 12px',
        }}
      >
        <img
          src="/images/landing/logo.webp"
          alt=""
          style={{ height: 18, opacity: 0.9, flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13,
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          inscrio.com/u/{username}
        </span>
      </div>
    </div>
  );
}
