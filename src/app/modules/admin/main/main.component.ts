import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CreateComputedOptions,
  HostListener,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { Router } from "@angular/router";
import { EmailActionAdmin, IAdminEmail } from "app/models/email-message";
import { AuthService } from "app/services/auth/auth.service";
import { MailingService } from "app/services/mailing/mailing.service";
import { User } from "firebase/auth";
import { Observable } from "rxjs";
import packageInfo from "../../../../../package.json";
import { MatDialog } from "@angular/material/dialog";
import { ModalEmailDetailsComponent } from "app/components/modals/modal-email-details/modal-email-details.component";

@Component({
  selector: "app-admin-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  private readonly _postPerPage = 10;
  private _emailList = signal<IAdminEmail[]>([]);
  private _httpError = signal<HttpErrorResponse | null>(null);
  private _selectedPage = signal(1);
  private _allPages = signal<number[]>([]);
  readonly appName = packageInfo.name;
  readonly appVersion = packageInfo.version;

  /* Pagination computed signal */
  readonly displayedEmails = computed(() => {
    const indexOfLastPost = this._selectedPage() * this._postPerPage;
    const indexOfFirstPost = indexOfLastPost - this._postPerPage;
    return this._emailList().slice(indexOfFirstPost, indexOfLastPost);
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private ms: MailingService,
    private modalRef: MatDialog
  ) {}

  /* Listener to tract vertical and horizontal pixels */
  @HostListener("window:scroll", ["$event"])
  checkPosition(): boolean {
    return window.scrollY > 60;
  }

  /**
   * Returns an observable of the current user or null.
   *
   * @return {Observable<User | null>} The observable of the current user or null.
   */
  get currentUser(): Observable<User | null> {
    return this.auth.currentUser;
  }

  /**
   * Returns the HTTP error response object if it exists, otherwise returns null.
   *
   * @return {HttpErrorResponse | null} The HTTP error response object or null.
   */
  get httpError(): HttpErrorResponse | null {
    return this._httpError();
  }

  /**
   * Returns the selected page as a WritableSignal.
   *
   * @return {WritableSignal<number>} The selected page as a WritableSignal.
   */
  get selectedPage(): WritableSignal<number> {
    return this._selectedPage;
  }

  /**
   * Returns the all pages as a WritableSignal.
   *
   * @return {WritableSignal<number[]>} The all pages as a WritableSignal.
   */
  get allPages(): WritableSignal<number[]> {
    return this._allPages;
  }

  /**
   * Returns the last page number from the array of all pages.
   *
   * @return {number} The last page number.
   */
  get lastPage(): number {
    return this._allPages().length;
  }

  /**
   * Updates the selected page with the provided page number.
   *
   * @param {number} page - The page number to set as the selected page.
   * @return {void} This function does not return a value.
   */
  changePage(page: number): void {
    this._selectedPage.set(page);
  }

  /**
   * Calculates the index based on the selected page, post per page, and the given index.
   *
   * @param {number} index - The index to calculate.
   * @return {number} The calculated index.
   */
  calcIndex(index: number): number {
    return (
      this.selectedPage() * this._postPerPage - this._postPerPage + index + 1
    );
  }

  /**
   * Function to generate numbers of page related to the number of table items.
   *
   * @param {Number}  totalPost
   * @param {Number}  postPerPage
   * @returns {Array<Number>}
   */
  private paginationItems = (
    totalPost: number,
    postPerPage: number
  ): number[] => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i += 1) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  /**
   * Asynchronously loads emails from the mail service and updates the email list.
   *
   * @return {Promise<void>} Promise that resolves when the emails are loaded and the email list is updated.
   */
  private async loadEmails(): Promise<void> {
    const resp = await this.ms.getAllEmails();
    if (resp instanceof HttpErrorResponse) {
      this.handleError(resp);
    } else {
      const mappedResp = Object.keys(resp).map((key) => ({
        id: key,
        ...resp[key],
      }));
      this.allPages.set(
        this.paginationItems(mappedResp.length, this._postPerPage)
      );
      this._emailList.update((prev) => [...prev, ...mappedResp]);
    }
  }

  /**
   * Opens the email modal and handles the actions performed on the email.
   *
   * @param {IAdminEmail} email - The email object to be displayed in the modal.
   * @return {void} This function does not return a value.
   */
  openEmailModal(email: IAdminEmail): void {
    this.modalRef
      .open(ModalEmailDetailsComponent, {
        data: email,
      })
      .afterClosed()
      .subscribe(({ id, action }) => {
        switch (action) {
          case EmailActionAdmin.ANSWERED:
            const respUpdate = this.ms.updateEmail(id);
            if (respUpdate instanceof HttpErrorResponse) {
              this.handleError(respUpdate);
            } else {
              this._emailList.update((prev) =>
                prev.map((email) =>
                  email.id === id ? { ...email, replay: true } : email
                )
              );
            }
            break;
          case EmailActionAdmin.DELETE:
            const respDelete = this.ms.deleteEmail(id);
            if (respDelete instanceof HttpErrorResponse) {
              this.handleError(respDelete);
            } else {
              this._emailList.update((prev) =>
                prev.filter((email) => email.id !== id)
              );
            }
            break;
        }
      });
  }

  /**
   * Sets the HTTP error to the provided error and clears it after a specified timeout.
   *
   * @param {HttpErrorResponse} error - The HTTP error response to be set.
   * @return {void} This function does not return a value.
   */
  handleError(error: HttpErrorResponse): void {
    this._httpError.set(error);
    setTimeout(() => this._httpError.set(null), 10000);
  }

  /**
   * Logs out the user by calling the logout method of the authentication service and navigating to the main page.
   *
   * @return {Promise<void>} A promise that resolves when the user is successfully logged out.
   */

  async logOut(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(["main-page"]);
  }

  /**
   * Initializes the component and loads the emails.
   *
   * @return {void}
   */
  ngOnInit(): void {
    this.loadEmails();
  }
}
