export interface InquiryOption {
  label: string
  value: string
}

export const INQUIRY_SOURCE = 'architectural-portfolio'

export const SERVICE_OPTIONS: InquiryOption[] = [
  { label: 'Interior Design', value: 'Interior Design' },
  { label: 'Architectural Design', value: 'Architectural Design' },
  { label: 'Residential Project', value: 'Residential Project' },
  { label: 'Commercial Project', value: 'Commercial Project' },
  { label: 'Renovation', value: 'Renovation' },
  { label: 'Consultation', value: 'Consultation' },
  { label: 'Other', value: 'Other' },
]

export const BUDGET_OPTIONS: InquiryOption[] = [
  { label: 'Under $10,000', value: 'Under $10,000' },
  { label: '$10,000 – $25,000', value: '$10,000 – $25,000' },
  { label: '$25,000 – $50,000', value: '$25,000 – $50,000' },
  { label: '$50,000 – $100,000', value: '$50,000 – $100,000' },
  { label: '$100,000+', value: '$100,000+' },
  { label: 'Not decided yet', value: 'Not decided yet' },
]

export const TIMELINE_OPTIONS: InquiryOption[] = [
  { label: 'ASAP', value: 'ASAP' },
  { label: '1 – 3 months', value: '1 – 3 months' },
  { label: '3 – 6 months', value: '3 – 6 months' },
  { label: '6 – 12 months', value: '6 – 12 months' },
  { label: 'Flexible', value: 'Flexible' },
]