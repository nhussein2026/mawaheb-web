// Shared form control classes so pages stop re-declaring Tailwind strings.
// They follow the field spec (§4.7): 40 px controls, border.control, 16 px
// text, labels above fields in label-md.
import { controlCls } from "../ui/controlStyles";

export const selectCls = `${controlCls} h-10 cursor-pointer`;

export const inputCls = `${controlCls} h-10`;

export const labelCls = "mb-1 block text-label-md text-text-primary";

export const textareaCls = `${controlCls} min-h-[88px] py-2 leading-7`;
