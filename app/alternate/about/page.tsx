import { permanentRedirect } from "next/navigation";

export default function AlternateAbout() {
  permanentRedirect("/alternate#about");
}
