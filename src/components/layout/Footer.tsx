const Footer = () => {
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0',
        width: '100%',
        boxSizing: 'border-box',
        padding: '2rem',
        backgroundColor: '#D9D9D9',
        color: '#000000',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>⚽ TECHCUP</div>
        <div style={{ textAlign: 'center' }}>+57 1234567890</div>
        <div style={{ textAlign: 'center' }}>info@techcup.com</div>
        <div style={{ textAlign: 'center' }}>Escuela Colombiana de Ingeniería Julio Garavito</div>
      </div>
    </footer>
  )
}

export default Footer
