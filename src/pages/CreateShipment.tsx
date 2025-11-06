
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/fetcher'
import { Barcode } from '../components/Barcode'
import type { ShipmentRequest, ShipmentResponse } from '../types/post'
import { LogOut, Printer, PlusCircle, Clipboard, Settings2 } from 'lucide-react'

const schema = z.object({
  receiverName: z.string().min(2, 'اسم گیرنده الزامی است'),
  receiverPhone: z.string().regex(/^\+?\d{8,15}$/,'فرمت تلفن صحیح نیست'),
  receiverAddress: z.string().min(5,'آدرس را کامل وارد کنید'),
  originCity: z.string().min(2),
  destinationCity: z.string().min(2),
  weightGrams: z.coerce.number().positive('وزن باید بزرگتر از صفر باشد'),
  lengthCm: z.coerce.number().optional(),
  widthCm: z.coerce.number().optional(),
  heightCm: z.coerce.number().optional(),
  codAmount: z.coerce.number().optional(),
  declaredValue: z.coerce.number().optional(),
  serviceCode: z.string().optional(),
  note: z.string().optional(),
  clientOrderRef: z.string().optional(),
  testMode: z.boolean().default(False => false)
})

type FormType = z.infer<typeof schema>

export const CreateShipment: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [result, setResult] = React.useState<ShipmentResponse | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormType>({
    resolver: zodResolver(schema), defaultValues: { testMode: false }
  })
  const testMode = watch('testMode')

  async function onSubmit(data: FormType) {
    setResult(null)
    const payload: ShipmentRequest = { ...data }
    const res = await api('/api/proxy/create-shipment', {
      method: 'POST',
      body: JSON.stringify({ payload, testMode })
    })
    setResult(res)
  }

  function printLabel() { window.print() }
  function copyCode() {
    if (result?.trackingCode) navigator.clipboard.writeText(result.trackingCode)
  }

  async function logout() {
    await api('/api/logout', { method: 'POST' })
    onLogout()
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">ایجاد مرسوله پست</h1>
        <div className="flex gap-2">
          <button onClick={logout} className="btn btn-ghost"><LogOut className="w-4 h-4" /> خروج</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card">
          <div className="mb-4 flex items-center gap-2">
            <Settings2 className="text-indigo-600" />
            <h2 className="font-semibold">فرم اطلاعات مرسوله</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="label">نام گیرنده*</label>
              <input className="input" {...register('receiverName')} />
              {errors.receiverName && <span className="error">{errors.receiverName.message}</span>}
            </div>

            <div className="field">
              <label className="label">تلفن گیرنده*</label>
              <input className="input" placeholder="+98912xxxxxxx" {...register('receiverPhone')} />
              {errors.receiverPhone && <span className="error">{errors.receiverPhone.message}</span>}
            </div>

            <div className="field md:col-span-2">
              <label className="label">آدرس کامل*</label>
              <input className="input" {...register('receiverAddress')} />
              {errors.receiverAddress && <span className="error">{errors.receiverAddress.message}</span>}
            </div>

            <div className="field">
              <label className="label">شهر مبدأ*</label>
              <input className="input" {...register('originCity')} />
              {errors.originCity && <span className="error">{errors.originCity.message}</span>}
            </div>

            <div className="field">
              <label className="label">شهر مقصد*</label>
              <input className="input" {...register('destinationCity')} />
              {errors.destinationCity && <span className="error">{errors.destinationCity.message}</span>}
            </div>

            <div className="field">
              <label className="label">وزن (گرم)*</label>
              <input type="number" className="input" {...register('weightGrams')} />
              {errors.weightGrams && <span className="error">{errors.weightGrams.message}</span>}
            </div>

            <div className="field">
              <label className="label">طول (cm)</label>
              <input type="number" className="input" {...register('lengthCm')} />
            </div>
            <div className="field">
              <label className="label">عرض (cm)</label>
              <input type="number" className="input" {...register('widthCm')} />
            </div>
            <div className="field">
              <label className="label">ارتفاع (cm)</label>
              <input type="number" className="input" {...register('heightCm')} />
            </div>

            <div className="field">
              <label className="label">COD (تومان)</label>
              <input type="number" className="input" {...register('codAmount')} />
            </div>

            <div className="field">
              <label className="label">Declared Value (تومان)</label>
              <input type="number" className="input" {...register('declaredValue')} />
            </div>

            <div className="field">
              <label className="label">Service Code</label>
              <input className="input" {...register('serviceCode')} />
            </div>

            <div className="field md:col-span-2">
              <label className="label">توضیحات</label>
              <input className="input" {...register('note')} />
            </div>

            <div className="field md:col-span-2">
              <label className="label">شناسه سفارش/قفسه (اختیاری)</label>
              <input className="input" placeholder="EFA-ORDER-12345" {...register('clientOrderRef')} />
            </div>

            <label className="flex gap-2 items-center md:col-span-2">
              <input type="checkbox" {...register('testMode')} />
              <span className="text-sm text-slate-700">حالت تست (بدون تماس واقعی با API)</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button disabled={isSubmitting} className="btn btn-primary">
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'در حال ثبت...' : 'ثبت مرسوله'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={()=>{ reset(); setResult(null); }}>
              فرم جدید
            </button>
          </div>
        </form>

        <div className="card label-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">پیش‌نمایش لیبل</h2>
            <div className="no-print flex gap-2">
              <button className="btn btn-ghost" onClick={copyCode}><Clipboard className="w-4 h-4" /> کپی کد</button>
              <button className="btn btn-primary" onClick={printLabel}><Printer className="w-4 h-4" /> پرینت لیبل</button>
            </div>
          </div>

          <div className="label-sheet border rounded-xl p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">{result?.trackingCode ? 'کد رهگیری' : 'منتظر ثبت...'}</div>
              {/** Optional top line (shelf/order) */}
              {/* reserved for future */}
            </div>

            <div className="grid place-items-center border rounded-xl p-3">
              {result?.trackingCode ? <Barcode code={result.trackingCode} /> : <div className="text-slate-500">هنوز کدی دریافت نشده</div>}
            </div>

            {result?.trackingCode && (
              <div className="text-xs text-slate-600 break-all">
                Tracking: <span className="font-mono">{result.trackingCode}</span>
              </div>
            )}
          </div>

          {result?.raw && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-slate-600">جزئیات پاسخ API</summary>
              <pre className="text-xs bg-slate-100 p-3 rounded-xl overflow-auto">{JSON.stringify(result.raw, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
