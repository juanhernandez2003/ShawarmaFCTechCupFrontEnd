interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div
      style={{
        backgroundColor: '#11823B',
        color: '#FFFFFF',
        width: '100%',
        padding: '1.5rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>{subtitle}</p>
      )}
    </div>
  )
}
