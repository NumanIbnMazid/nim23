import path from "path"
import { readFileSync } from "fs"
import { sync } from "glob"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import { FrontMatter } from "./types"

export default class MDXContent {
  private POST_PATH: string
  constructor(folderName: string) {
    this.POST_PATH = path.join(process.cwd(), folderName)
  }

  getSlugs() {
    const paths = sync(`${this.POST_PATH}/*.mdx`)
    return paths.map((path) => {
      const parts = path.split("/")
      const fileName = parts[parts.length - 1]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [slug, _ext] = fileName.split(".")
      return slug
    })
  }

  getFrontMatter(slug: string): FrontMatter | null {
    const postPath = path.join(this.POST_PATH, `${slug}.mdx`)
    const source = readFileSync(postPath)
    const { data } = matter(source)
    const readingTime = null

    if (!data.published) return null

    return {
      slug,
      readingTime: readingTime ?? { text: "", minutes: 0, time: 0, words: 0 },
      excerpt: data.excerpt ?? "",
      title: data.title ?? slug,
      date: (data.date ?? new Date()).toString(),
      keywords: data.keywords ?? "",
      image: data.image ?? "https://i.postimg.cc/pV6bX2rY/numan.jpg",
      url: data.url ?? ""
    }
  }

  async getPostFromSlug(slug: string, force = false) {
    const postPath = path.join(this.POST_PATH, `${slug}.mdx`)
    const source = readFileSync(postPath)
    const { content, data } = matter(source)
    if (!data.published && !force) return { post: null }

    const frontMatter = this.getFrontMatter(slug)

    const prettyCodeOptions = {
      theme: "one-dark-pro",
      onVisitLine(node: any) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }]
        }
      },
      // Feel free to add classNames that suit your docs
      onVisitHighlightedLine(node: any) {
        node.properties.className.push("highlighted")
      },
      onVisitHighlightedWord(node: any) {
        node.properties.className = ["word"]
      },
    }
    const mdxSource = await serialize(content, {
      mdxOptions: {
        development: process.env.NODE_ENV !== 'production',
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behaviour: "wrap" }],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    })
    return {
      post: {
        source: mdxSource,
        tableOfContents: this.getTableOfContents(content),
        meta: frontMatter,
      },
    }
  }

  getAllPosts(length?: number | undefined) {
    const allPosts = this.getSlugs()
      .map((slug) => {
        return this.getFrontMatter(slug)
      })
      .filter((post) => post !== null) // Filter post if it is not published
      .sort((a, b) => {
        if (new Date(a!.date) > new Date(b!.date)) return -1
        if (new Date(a!.date) < new Date(b!.date)) return 1
        return 0
      })

    return length === undefined ? allPosts : allPosts.slice(0, length)
  }

  getTableOfContents(markdown: string) {
    const regXHeader = /#{2,6}.+/g
    const headingArray = markdown.match(regXHeader)
      ? markdown.match(regXHeader)
      : []
    return headingArray?.map((heading) => {
      return {
        level: heading.split("#").length - 1 - 2, // we starts from the 2nd heading that's why we subtract 2 and 1 is extra heading text
        heading: heading.replace(/#{2,6}/, "").trim(),
      }
    })
  }
}
