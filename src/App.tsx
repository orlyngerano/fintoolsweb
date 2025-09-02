import React, { useEffect, useState } from 'react';
import { Button, Container, FormControl, FormLabel, InputAdornment, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import init, { get_price_bs } from './fintools/fintools';
import { FormControlLabel } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormInput = {
  currentPrice: number,
  strikePrice: number,
  timeToExpire: number,
  riskFree: number,
  volatility: number,
  optionType: OptionType,
}

enum OptionType {
  call = "call",
  put = "put",
};

enum FieldLabel {
  currentPrice = "Current stock price",
  strikePrice = "Strike price",
  timeToExpire = "Time to expiration",
  riskFree = "Risk-free interest rate",
  volatility = "Volatility",
}

const App = () => {
    const [fairValuePrice, setFairValuePrice] = useState<number>();

  const { register, handleSubmit, formState: { errors }, control} = useForm<FormInput>({
    defaultValues: {
      optionType: OptionType.call
    }
  })

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const {currentPrice, strikePrice, timeToExpire, riskFree, volatility, optionType} = data;
    const averageYearLength = 365.2425;
    const price = get_price_bs(currentPrice, strikePrice, timeToExpire / averageYearLength, riskFree / 100, volatility / 100, optionType);
    setFairValuePrice(price);
  }

  useEffect(() => {
    init();
  }, []);


  return <Container maxWidth="sm">
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <h2>Getting Price of European-style option using<br />Black-Scholes Model</h2>
        <TextField
          label={FieldLabel.currentPrice}
          {...register("currentPrice", { required: `${FieldLabel.currentPrice} is required` })}
          error={!!errors?.currentPrice}
          helperText={errors?.currentPrice?.message}
          type="number"
          slotProps={{
            htmlInput:{
              step: 0.01
            },
          }}
        />
        <TextField
          label={FieldLabel.strikePrice}
          {...register("strikePrice", { required: `${FieldLabel.strikePrice} is required` })}
          error={!!errors?.strikePrice}
          helperText={errors?.strikePrice?.message}
          type="number"
          slotProps={{
            htmlInput:{
              step: 0.01,
            },
          }}
        />
        <TextField
          label={FieldLabel.timeToExpire}
          {...register("timeToExpire", { required: `${FieldLabel.timeToExpire} is required` })}
          error={!!errors?.timeToExpire}
          helperText={errors?.timeToExpire?.message}
          type="number"
          slotProps={{
            htmlInput:{
              step: 0.01
            },
            input: {
              endAdornment: <InputAdornment position="start">Days</InputAdornment>,
            },
          }}
        />
        <TextField
          label={FieldLabel.riskFree}
          {...register("riskFree", { required: `${FieldLabel.riskFree} is required` })}
          error={!!errors?.riskFree}
          helperText={errors?.riskFree?.message}
          type="number"
          slotProps={{
            htmlInput:{
              step: 0.01
            },
            input: {
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            },
          }}
        />
        <TextField
          label={FieldLabel.volatility}
          {...register("volatility", { required: `${FieldLabel.volatility} is required` })}
          error={!!errors?.volatility}
          helperText={errors?.volatility?.message}
          type="number"
          slotProps={{
            htmlInput:{
              step: 0.01
            },
            input: {
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            },
          }}
        />
        <FormControl {...register("optionType")}>
          <FormLabel id="opton-group-label">Option Type</FormLabel>
          <Controller
            name="optionType"
            control={control}
            render={({field}) =>
              <RadioGroup
                value={field.value}
                row
                aria-labelledby="opton-group-label"
                onChange={(p) =>field.onChange(p)}
              >
                <FormControlLabel value={OptionType.call} control={<Radio />} label="Call" />
                <FormControlLabel value={OptionType.put} control={<Radio />} label="Put" />
              </RadioGroup>
            }
          />

        </FormControl>
        <Button variant="contained" type='submit'>Get Price</Button>
        {fairValuePrice && <h2>Fair market price = {fairValuePrice.toFixed(2)}</h2>}
      </Stack>
    </form>
  </Container>


}

export default App;
