
import React from 'react'
import JsBarcode from 'jsbarcode'

type Props = { code: string }

export const Barcode: React.FC<Props> = ({ code }) => {
  const ref = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    if (ref.current && code) {
      try {
        JsBarcode(ref.current, code, {
          format: 'CODE128',
          displayValue: true,
          text: code,
          fontOptions: 'bold',
          fontSize: 16,
          margin: 0,
          width: 2,
          height: 80,
        })
      } catch (e) {
        console.error('Barcode error', e)
      }
    }
  }, [code])

  return <svg ref={ref} />
}
