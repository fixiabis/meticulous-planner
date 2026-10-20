import { cn } from '@/lib/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function selectAllContent(element: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export type ContentEditableProps = {
  className?: string;
  content: string;
  placeholder?: string;
  onEditStart?: () => void;
  onEditUpdate?: (content: string) => void;
  onEditEnd?: () => void;
  onContentChange?: (content: string) => void;
};

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(function ContentEditable(props, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editingContent, setEditingContent] = useState(props.content);

  useImperativeHandle(ref, () => editorRef.current!);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = escapeHtml(props.content).replace(/\n/g, '<br>');
  }, [props.content]);

  const handleClick = () => {
    if (editingContent.trim() === '' && editorRef.current) {
      editorRef.current.innerHTML = '&nbsp;';
      selectAllContent(editorRef.current);
    }
    props.onEditStart?.();
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const text = e.currentTarget.innerText ?? '';

    if (editingContent.trim() === '' || text.trim() === '') {
      const nativeEvent = e.nativeEvent as InputEvent;
      if (nativeEvent.inputType === 'deleteContentBackward' || nativeEvent.inputType === 'deleteContentForward') {
        if (!editorRef.current) return;
        editorRef.current.innerHTML = '&nbsp;';
        selectAllContent(editorRef.current);
        setEditingContent('');
        props.onEditUpdate?.('');
        return;
      }
    }

    const content = text;
    setEditingContent(content);
    props.onEditUpdate?.(content);
  };

  const handleBlur = () => {
    props.onEditEnd?.();
    props.onContentChange?.(editingContent);

    if (editingContent.trim() === '' && editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  // 可編輯區與 placeholder 疊在同一個 grid cell：尚無內容時容器寬度跟隨 placeholder，有內容後跟隨文字，最少 1em
  return (
    <span className={cn('inline-grid align-baseline', props.className)}>
      <span
        ref={editorRef}
        tabIndex={0}
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        className="col-start-1 row-start-1 min-w-[1em] cursor-text whitespace-pre-wrap"
        onInput={handleInput}
        onClick={handleClick}
        onBlur={handleBlur}
      />
      {editingContent === '' && props.placeholder && (
        <span
          aria-hidden
          className="col-start-1 row-start-1 pointer-events-none select-none whitespace-pre-wrap opacity-30"
        >
          {props.placeholder}
        </span>
      )}
    </span>
  );
});
