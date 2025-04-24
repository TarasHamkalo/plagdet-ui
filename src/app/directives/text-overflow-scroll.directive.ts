import {Directive, HostBinding, HostListener} from "@angular/core";
import {Clipboard} from "@angular/cdk/clipboard";

@Directive({
  selector: "[appTextOverflowScroll]"
})
export class TextOverflowScrollDirective {

  @HostBinding("class.scrolled") isScrolled = false;

  @HostBinding("class.text-copy") isCopied = false;

  @HostBinding("attr.tabindex") tabindex = "0";

  constructor(
    private clipboard: Clipboard
  ) {
  }

  @HostListener("scroll", ["$event.target"])
  public onScroll(target: HTMLElement): void {
    this.isScrolled = target.scrollLeft > 0;
  }

  @HostListener("click", ["$event.target"])
  public onClick(target: HTMLElement): void {
    const textContent = target.textContent;
    if (textContent) {
      this.clipboard.copy(textContent);
      this.showFeedback();
    }
  }

  private showFeedback() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 500);
  }
}

