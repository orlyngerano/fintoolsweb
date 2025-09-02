use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_price_bs(s: f32, k: f32, t: f32, r: f32, sigma: f32, option_type: &str) -> f32 {
    // d1 = [ln(S/K) + (r + σ²/2) * T] / (σ * √T)
    let d1 = ((s / k).ln() + (r + sigma.powi(2) / 2.0) * t) / (sigma * t.sqrt());
    
    // d2 = d1 - σ * √T
    let d2 = d1 - sigma * t.sqrt();
    
    // normal distribution of d1
    let nd1 = normdist(d1);

    // normal distribution of d2
    let nd2: f32 = normdist(d2);

    // Calculate the Present Value of the Strike Price:
    let pv_k = k * (-r * t).exp();

    let price = match option_type {
        // Calculate the Call Option Price (C):
        "call" => s * nd1 - pv_k * nd2,
        // Calculate the Put Option Price (P):
        "put" => pv_k * (1.0 - nd2) - s * (1.0 - nd1),
        _ => 0.0,
    };

    price
}   

pub fn erf(z:f32)-> f32
{
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;
    let x = z.abs() ;
    let t = 1.0 / (1.0 + p * z);
    let ans = 1.0 - ((((((a5 * t + a4) * t) + a3) * t + a2) * t) + a1) * t * (-1.0 * x * x).exp();
    
    ans 
}

pub fn normdist(z:f32)-> f32
{
    let sign = if z < 0.0 {
        -1.0
    } else {
        1.0
    };

    let two = 2.0_f32;

    let ans = 0.5 * (1.0 + sign * erf(z.abs()/two.sqrt()));
    
    ans
}


