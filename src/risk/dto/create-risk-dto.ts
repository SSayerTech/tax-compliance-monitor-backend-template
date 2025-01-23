// export class Taxpayer {

//   @Prop({ type: TaxpayerInfo, required: true })  // Relación con el subdocumento TaxpayerInfo
//   taxpayerInfo: TaxpayerInfo;

//   @Prop({ type: RiskProfile, required: true })  // Relación con el subdocumento RiskProfile
//   riskProfile: RiskProfile;

//   @Prop({ type: [HistoricalRiskData], required: false })
//   historicalRiskData?: HistoricalRiskData[];  
// }
import { TaxpayerInfo, RiskProfile, HistoricalRiskData } from "src/database/schemas/taxpayer.schema";


export class CreateRiskDto{
    taxpayerInfo: TaxpayerInfo
    riskProfile: RiskProfile
    history?: HistoricalRiskData[]
}