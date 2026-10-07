import { jsPDF } from 'jspdf'
import { cv } from '../data/cv'
import { formatTimelinePeriod } from './timeline'

// Vector text and native PDF links: no screenshot or dependency on the current theme.
export function createCvPdf() {
  const doc = new jsPDF({ format: 'a4', unit: 'mm', compress: true, putOnlyUsedFonts: true })
  const ink = '#182b3d'
  const muted = '#526373'
  const accent = '#276aa9'
  const clean = (text: string) => text.replace(/[‘’]/g, "'").replace(/[–—]/g, '-')
  doc.setProperties({ title: `CV - ${cv.name}`, author: cv.name, subject: cv.title, keywords: 'C#, .NET, Software Engineer, Renault Trucks, CPE Lyon' })
  doc.setLanguage('fr-FR')
  doc.setFillColor(accent).rect(16, 14, 16, 1.2, 'F')
  doc.setFont('helvetica', 'bold').setFontSize(29).setTextColor(ink).text(cv.name, 16, 27)
  doc.setFontSize(15).setTextColor(accent).text(cv.title, 16, 36)
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(ink).text(clean(cv.subtitle), 16, 43)
  doc.setFontSize(8.5).setTextColor(muted).text(`${cv.location} · ${cv.graduation}`, 16, 50)
  doc.textWithLink(cv.email, 16, 56, { url: `mailto:${cv.email}` })
  let linkX = 109
  for (const link of cv.links) {
    doc.textWithLink(link.label, linkX, 56, { url: link.href })
    linkX += doc.getTextWidth(link.label) + 5
  }
  doc.setTextColor(ink).setFontSize(9.4)
  const summary: string[] = doc.splitTextToSize(clean(cv.summary), 178)
  doc.text(summary, 16, 66, { lineHeightFactor: 1.35 })
  const top = 66 + summary.length * 4.5 + 7
  doc.setDrawColor('#d9e2e8').setLineWidth(.25).line(132, top - 2, 132, 277)
  const headedPages = new Set([1])

  function column(x: number, width: number) {
    let y = top
    let page = 1
    const ensure = (height: number) => {
      if (y + height <= 277) return
      page += 1
      if (page > doc.getNumberOfPages()) doc.addPage()
      else doc.setPage(page)
      if (!headedPages.has(page)) {
        doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(ink).text(cv.name, 16, 19)
        headedPages.add(page)
      }
      y = 30
    }
    const text = (value: string, size = 9.2, bold = false, color = ink, gap = .8) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(size)
      const lines: string[] = doc.splitTextToSize(clean(value), width)
      const lineHeight = size * .3528 * 1.3
      ensure(lines.length * lineHeight + gap)
      doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(size).setTextColor(color)
      doc.text(lines, x, y, { lineHeightFactor: 1.3 })
      y += lines.length * lineHeight + gap
    }
    return {
      text,
      heading(value: string) { ensure(16); text(value.toLocaleUpperCase('fr-FR'), 9, true, accent, 3) },
      reserve: ensure,
      gap(value = 4) { y += value },
    }
  }

  const main = column(16, 108)
  main.heading('Expériences professionnelles')
  for (const item of cv.experiences) {
    main.reserve(24)
    main.text(item.place, 10.5, true)
    main.text(`${item.title} | ${formatTimelinePeriod(item)}`, 8.1, false, muted)
    for (const highlight of item.highlights) main.text(`• ${highlight}`, 9.2)
    if (item.stack) main.text(item.stack.join(' · '), 8.2, false, accent)
    main.gap(3)
  }
  main.heading('Projets personnels')
  for (const project of cv.projects) {
    const projectHeight = [
      { value: project.name, size: 10, style: 'bold' },
      { value: project.description, size: 9, style: 'normal' },
      { value: project.stack, size: 8.1, style: 'normal' },
    ].reduce((height, part) => {
      doc.setFont('helvetica', part.style).setFontSize(part.size)
      return height + doc.splitTextToSize(clean(part.value), 108).length * part.size * .3528 * 1.3 + .8
    }, 2)
    main.reserve(projectHeight)
    main.text(project.name, 10, true)
    main.text(project.description, 9)
    main.text(project.stack, 8.1, false, accent)
    main.gap(2)
  }

  doc.setPage(1)
  const side = column(140, 54)
  side.heading('Formation')
  for (const item of cv.education) {
    side.text(item.title, 10, true)
    side.text(formatTimelinePeriod(item), 8.2, false, muted)
    side.text(item.place, 9)
    side.text(item.detail, 8.5, false, muted)
    side.gap(3)
  }
  side.heading('Compétences')
  for (const skill of cv.skills) {
    side.text(skill.title, 9.2, true)
    side.text(skill.items.join(' · '), 8.8, false, muted)
    side.gap(2)
  }
  side.heading('Langues')
  for (const language of cv.languages) side.text(`${language.name} : ${language.level}`, 8.8)
  side.gap(4)
  side.heading('Centres d’intérêt')
  side.text(cv.interests, 8.8, false, muted)

  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page)
    doc.setDrawColor('#d9e2e8').line(16, 283, 194, 283)
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(muted)
    doc.textWithLink('quentin-bouchot.fr', 16, 289, { url: cv.links[0].href })
    doc.text(`${page} / ${doc.getNumberOfPages()}`, 194, 289, { align: 'right' })
  }
  return doc
}
