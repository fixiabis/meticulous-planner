export type CodeFileProps = {
  readonly path: string;
  readonly content: string;
};

export class CodeFile implements CodeFileProps {
  readonly path: string;
  readonly content: string;

  constructor(props: CodeFileProps) {
    this.path = props.path;
    this.content = props.content;
  }
}
