"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBlogPages() {
  // Revalidate all blog-related paths
  revalidatePath("/blog", "layout");
}

export async function revalidateProjectPages() {
  // Revalidate all project-related paths
  revalidatePath("/project", "layout");
}

export async function revalidateWorkPages() {
  // Revalidate all work-related paths
  revalidatePath("/work", "layout");
}
