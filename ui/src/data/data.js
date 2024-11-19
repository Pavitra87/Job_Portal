import accounting from "../assets/category/accounting.png";
import care from "../assets/category/care.png";
import cleaning from "../assets/category/cleaning.png";
import cooking from "../assets/category/cooking.png";
import healthcare from "../assets/category/healthcare.png";
import media from "../assets/category/media.png";
import others from "../assets/category/others.png";
import painting from "../assets/category/painting.png";
import plumbing from "../assets/category/plumbing.png";
import sales from "../assets/category/sales.png";
import teaching from "../assets/category/teaching.png";
import travelling from "../assets/category/travelling.png";
import { useTranslation } from "react-i18next";

const data = [
  {
    name: "Finance & Accounting",
    img: accounting,
  },
  {
    name: "Healthcare & Medicine",
    img: healthcare,
  },
  {
    name: "Sales & Marketing",
    img: sales,
  },
  {
    name: "Education & Training",
    img: teaching,
  },
  {
    name: "Transportation & Logistics",
    img: travelling,
  },
  {
    name: "Creative & Media",
    img: media,
  },
  {
    name: "Cleaning Services",
    img: cleaning,
  },
  {
    name: "Plumbing & Electrical Services",
    img: plumbing,
  },
  {
    name: "Painting & Home Décor",
    img: painting,
  },
  {
    name: "Event Catering & cooking",
    img: cooking,
  },
  {
    name: "Care taker",
    img: care,
  },
  {
    name: "others",
    img: others,
  },
];

export default data;
