import { useEffect, useRef, useState } from 'react';

// Reusable hook to make MUI Dialogs draggable by their title bar
// Usage:
// const { paperProps, titleProps } = useDraggableDialog(open);
// <Dialog PaperProps={paperProps}> <DialogTitle {...titleProps}> ...
export function useDraggableDialog(open, recenterDeps = []) {
    const paperRef = useRef(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (!open) return;
        const centerDialog = () => {
            const rect = paperRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = Math.max(0, (window.innerWidth - rect.width) / 2);
            const y = Math.max(0, (window.innerHeight - rect.height) / 2);
            setDragPos({ x, y });
        };
        const id = setTimeout(centerDialog, 0);
        // Recenter on window resize while open
        const onResize = () => centerDialog();
        window.addEventListener('resize', onResize);
        return () => {
            clearTimeout(id);
            window.removeEventListener('resize', onResize);
        };
    }, [open, ...recenterDeps]);

    const handleWindowMouseMove = (event) => {
        if (!isDraggingRef.current) return;
        setDragPos({
            x: event.clientX - dragStartRef.current.x,
            y: event.clientY - dragStartRef.current.y,
        });
    };

    const handleWindowMouseUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
    };

    const handleTitleMouseDown = (event) => {
        isDraggingRef.current = true;
        dragStartRef.current = {
            x: event.clientX - dragPos.x,
            y: event.clientY - dragPos.y,
        };
        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
    };

    return {
        paperProps: { ref: paperRef, sx: { position: 'fixed', top: dragPos.y, left: dragPos.x, m: 0 } },
        titleProps: { onMouseDown: handleTitleMouseDown, sx: { cursor: 'move', userSelect: 'none' } },
    };
}


