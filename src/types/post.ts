
// Map types based on assumed Post API; adjust in /types if your API differs.
export interface ShipmentRequest {
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  originCity: string
  destinationCity: string
  weightGrams: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  codAmount?: number
  declaredValue?: number
  serviceCode?: string
  note?: string
  clientOrderRef?: string
}

export interface ShipmentResponse {
  trackingCode: string
  labelUrl?: string
  raw?: unknown
}
