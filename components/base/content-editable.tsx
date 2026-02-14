import { cn } from '@/lib/utils';
import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(props.content);

  useImperativeHandle(ref, () => editorRef.current!);

  useEffect(() => {
    if (!editorRef.current) return;
    setEditingContent(props.content);
    editorRef.current.innerHTML = escapeHtml(props.content).replace(/\n/g, '<br>');
  }, [props.content]);

  const handleClick = () => {
    if (editingContent.trim() === '' && editorRef.current) {
      editorRef.current.innerHTML = '&nbsp;';
      selectAllContent(editorRef.current);
    }
    setIsEditing(true);
    props.onEditStart?.();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
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
    setIsEditing(false);
    props.onEditEnd?.();
    props.onContentChange?.(editingContent);

    if (editingContent.trim() === '' && editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  return (
    <div
      ref={editorRef}
      tabIndex={0}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      className={cn(
        'relative isolate cursor-text',
        '[&:after]:content-(--placeholder) [&:after]:opacity-50 [&:after]:whitespace-pre-wrap',
        editingContent !== '' || isEditing
          ? '[&:after]:absolute [&:after]:block [&:after]:top-0 [&:after]:left-0 [&:after]:w-full [&:after]:h-full [&:after]:-z-10'
          : '',
        props.className,
      )}
      style={
        {
          '--placeholder': `"${
            editingContent !== '' ? '' : props.placeholder?.replace(/"/g, '\\"').replace(/\n/g, '\\A') || ''
          }"`,
        } as CSSProperties
      }
      onInput={handleInput}
      onClick={handleClick}
      onBlur={handleBlur}
    />
  );
});
