import {
  Radio,
  Box,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  FormLabel,
} from "@chakra-ui/react";
import { CurveMethods } from "@backend/services/curveGrades";

export type CurveMethod = {
  displayName: string;
  backendName: CurveMethods;
  optionFields:
    | {
        name: string;
        backendName: string;
        minValue: number;
        maxValue: number;
        changeHandler: (numberString: string) => void;
      }[]
    | null;
};

export default function CurveMethodDisplay(props: {
  currentSelectedIndex: number;
  index: number;
  curveMethod: CurveMethod;
}) {
  const { currentSelectedIndex, index, curveMethod } = props;

  const noOptionFields = (
    <Radio value={index} key={curveMethod.displayName} colorScheme="accent">
      {" "}
      {curveMethod.displayName}{" "}
    </Radio>
  );

  const withOptionFields = (
    optionFields: {
      name: string;
      backendName: string;
      minValue: number;
      maxValue: number;
      changeHandler: (numberString: string) => void;
    }[]
  ) => (
    <>
      {noOptionFields}
      <Box display={currentSelectedIndex === index ? undefined : "none"}>
        <Stack direction="row">
          {optionFields.map((option) => (
            <Stack direction="column" key={option.name}>
              <FormLabel hmtlFor={`${option.name}`}>{option.name}</FormLabel>
              <NumberInput
                variant="flushed"
                focusBorderColor="accent.100"
                min={option.minValue}
                max={option.maxValue}
                step={0.1}
                precision={1}
                id={option.name}
                aria-label={`number-input-${option.name}`}
                onChange={option.changeHandler}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );

  if (curveMethod.optionFields) {
    return withOptionFields(curveMethod.optionFields);
  } else {
    return noOptionFields;
  }
}

export function generateCurveMethods(
    handleCurveOptions: (
      numberString: string,
      property: "max" | "min" | "mean" | "std"
    ) => void
  ) {
    const noCurve: CurveMethod = {
      displayName: "No Curve",
      backendName: "none",
      optionFields: null,
    };
  
    const linearCurve: CurveMethod = {
      displayName: "Linear Scale",
      backendName: "linear",
      optionFields: [
        {
          name: "Min. score",
          backendName: "min",
          minValue: 0,
          maxValue: 100,
          changeHandler: (numberString: string) =>
            handleCurveOptions(numberString, "min"),
        },
        {
          name: "Max. score",
          backendName: "max",
          minValue: 0,
          maxValue: 100,
          changeHandler: (numberString: string) =>
            handleCurveOptions(numberString, "max"),
        },
      ],
    };
  
    const meanStdCurve: CurveMethod = {
      displayName: "Mean and Standard Deviation Curve",
      backendName: "mstd",
      optionFields: [
        {
          name: "Desired Mean",
          backendName: "mean",
          minValue: 0,
          maxValue: 100,
          changeHandler: (numberString: string) =>
            handleCurveOptions(numberString, "mean"),
        },
        {
          name: "Desired Standard Deviation",
          backendName: "std",
          minValue: 0,
          maxValue: 100,
          changeHandler: (numberString: string) =>
            handleCurveOptions(numberString, "std"),
        },
      ],
    };
  
    const highestScoreCurve: CurveMethod = {
      displayName: "Highest Score Curve",
      backendName: "highest",
      optionFields: null,
    };
  
    const secondHighestScoreCurve: CurveMethod = {
      displayName: "Second Highest Score Curve",
      backendName: "second",
      optionFields: null,
    };
  
    const curveMethods = [
      noCurve,
      linearCurve,
      meanStdCurve,
      highestScoreCurve,
      secondHighestScoreCurve,
    ];
  
    return curveMethods;
  }