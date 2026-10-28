# Authentication previews

| Menu    | Route      | Feature  | Visual reference                                                |
| ------- | ---------- | -------- | --------------------------------------------------------------- |
| Login 1 | `/login-1` | `auth-1` | [ReUI auth-20](https://reui.io/blocks/application/auth/auth-20) |
| Login 2 | `/login-2` | `auth-2` | [ReUI auth-1](https://reui.io/blocks/application/auth/auth-1)   |
| Login 3 | `/login-3` | `auth-3` | [ReUI auth-8](https://reui.io/blocks/application/auth/auth-8)   |
| Login 4 | `/login-4` | `auth-4` | [ReUI auth-4](https://reui.io/blocks/application/auth/auth-4)   |
| Login 5 | `/login-5` | `auth-5` | [ReUI auth-18](https://reui.io/preview/base/auth-18)            |

Login 1–5 are independent implementations based on the publicly visible previews, using this project's Base UI components and theme tokens. They are **not installed copies of the licensed ReUI Pro registry source**. The registry requires a ReUI license key that is not configured in this project.

The [MIT license](LICENSE) is preserved for the Google mark reused from WIT. Studio. It does not license ReUI Pro blocks. No ReUI source license is asserted for these independent layouts.

All pages are frontend previews. Login 1–5 use native required-field validation and a password visibility toggle. Submitting displays a preview message without sending or storing credentials or creating a session. Social sign-in, password recovery, and account creation open explanatory dialogs. Public registration remains unavailable. The application root redirects to Login 1 (`/login-1`).

Login 5 uses a 5/12 testimonial panel and a 7/12 form panel on desktop, with the testimonial hidden below the large breakpoint. Its quote and example brand names are sample content from the ReUI preview, not endorsements of WIT. Studio.

Login 4 is based only on the public description of auth-4 (framed card on a noise background, Google/Apple/GitHub row, Privacy/Terms/Status footer); the block source is not publicly available.

Images are local copies of the Unsplash photographs visible in the public references:

- Login 2, light: https://images.unsplash.com/photo-1743657166981-8d8e11d03c3e
- Login 2, dark: https://images.unsplash.com/photo-1651065567117-ac52c1a62e21
- Login 3: https://images.unsplash.com/photo-1557804506-669a67965ba0
- Login 5 avatar: https://images.unsplash.com/photo-1500648767791-00dcc994a43e

The new pages inherit font, theme, scale, radius, and primary-color preferences from the root provider. They intentionally render outside the dashboard shell.
