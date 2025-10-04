export const scrollToBottom = (
  container: HTMLElement | null,
  smooth = false,
) => {
  if (container?.children.length) {
    const lastElement = container?.lastChild as HTMLElement

    lastElement?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
      inline: 'nearest',
    })
  }
}