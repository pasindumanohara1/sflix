interface AdSlotProps {
  position: 'top' | 'between' | 'detail' | 'browse';
}

export default function AdSlot({ position }: AdSlotProps) {
  return (
    <div className={`ad-slot ad-${position}`}>
      <div className="ad-placeholder">
        <span>Ad</span>
      </div>

      <style>{`
        .ad-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0;
        }

        .ad-placeholder {
          width: 100%;
          max-width: 728px;
          height: 90px;
          background: var(--bg-dark);
          border: 1px dashed var(--bg-tertiary);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .ad-between .ad-placeholder {
          height: 60px;
          max-width: 468px;
        }

        .ad-detail .ad-placeholder {
          height: 60px;
          max-width: 468px;
        }

        .ad-browse .ad-placeholder {
          height: 60px;
          max-width: 468px;
        }
      `}</style>
    </div>
  );
}
