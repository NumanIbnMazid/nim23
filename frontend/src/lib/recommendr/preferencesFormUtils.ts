export function buildPayload(formData: any) {
  return {
    mood: formData.mood,
    media_type: formData.media_type,
    language: formData.language.length > 0 ? formData.language : [''],
    occasion: formData.occasion.length > 0 ? formData.occasion : [''],
    genres: formData.genres.length > 0 ? formData.genres : [''],
    media_age: formData.media_age.length > 0 ? formData.media_age : [''],
    rating: formData.rating.length > 0 ? formData.rating : [''],
    categories: formData.categories.length > 0 ? formData.categories : [''],
    other_preferences: formData.other_preferences || '',
  }
}

export function getFieldDefinitions(preferences: any, formData: any) {
  return [
    { label: 'Language', key: 'language', options: preferences.language, multi: true },
    {
      label: 'Genres',
      key: 'genres',
      options: [
        ...(preferences.genres[formData.media_type] || []),
        ...(formData.genres || []).filter((g: string) => !(preferences.genres[formData.media_type] || []).includes(g)),
      ],
      multi: true,
    },
    { label: 'Occasion', key: 'occasion', options: preferences.occasion, multi: true },
    { label: 'Media Age', key: 'media_age', options: preferences.media_age, multi: true },
    { label: 'Rating', key: 'rating', options: preferences.rating, multi: true },
    {
      label: 'Categories',
      key: 'categories',
      options: [
        ...(preferences.categories[formData.media_type] || []),
        ...(formData.categories || []).filter(
          (c: string) => !(preferences.categories[formData.media_type] || []).includes(c)
        ),
      ],
      multi: true,
    },
    { label: 'Other Preferences', key: 'other_preferences', isTextInput: true },
  ]
}
