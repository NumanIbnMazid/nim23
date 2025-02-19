/* Formats a date as a string in the format 'Month day, year'. */
export function getFormattedDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/**
 * ✅ Convert start & end date to readable duration (e.g., "Jan 2020 - Present").
 */
export function getDuration(startDate: Date, endDate: Date | null, isPresent: boolean): string {
  if (!isPresent && !endDate) {
    throw new Error('End date is required to calculate duration. Provide end date or mark as present.')
  }
  if (isPresent && endDate) {
    throw new Error('End date is not required when marked as present. Remove end date or mark as not present.')
  }

  const start = startDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  const end = isPresent ? 'Present' : endDate?.toLocaleString('en-US', { month: 'short', year: 'numeric' })

  return `${start} - ${end}`
}

/**
 * ✅ Convert start & end date to duration in a readable format (e.g., "2 Years, 3 Months").
 */
export function getDurationInDays(startDate: Date, endDate: Date | null, isPresent: boolean): string {
  if (!isPresent && !endDate) {
    throw new Error('End date is required to calculate duration in days. Provide end date or mark as present.')
  }
  if (isPresent && endDate) {
    throw new Error('End date is not required when marked as present. Remove end date or mark as not present.')
  }

  const finalEndDate = isPresent ? new Date() : endDate!
  const durationMs = finalEndDate.getTime() - startDate.getTime()
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24))

  const years = Math.floor(durationDays / 365)
  const months = Math.floor((durationDays % 365) / 30)
  const days = durationDays % 30

  let durationStr = ''
  if (years > 0) durationStr += `${years} Year${years > 1 ? 's' : ''}, `
  if (months > 0) durationStr += `${months} Month${months > 1 ? 's' : ''}`
  if (years < 1 && months < 1) durationStr = `${days} Day${days > 1 ? 's' : ''}`

  return durationStr.trim()
}

// src/utils/timeFormatter.ts

/**
 * Formats a timestamp into a human-readable time difference
 * (e.g., "5 minutes ago", "3 days ago", "2 years ago").
 *
 * @param timestamp - The date string or timestamp to format.
 * @returns A formatted time difference string.
 */
export function timeAgo(timestamp: string | number): string {
  const now = new Date()
  const createdAt = new Date(timestamp)
  const timeDifference = Math.floor((now.getTime() - createdAt.getTime()) / 1000) // Difference in seconds

  if (timeDifference < 60) {
    return `${timeDifference} second${timeDifference !== 1 ? 's' : ''} ago`
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (timeDifference < 2592000) {
    const days = Math.floor(timeDifference / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (timeDifference < 31536000) {
    const months = Math.floor(timeDifference / 2592000)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(timeDifference / 31536000)
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }
}
