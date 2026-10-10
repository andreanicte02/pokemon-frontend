import { useState, type ReactNode } from "react";
import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { usePokemonAllQuery } from "../../../store/api/service/pokemon";
import {
   useCreateRegistrationMutation,
   useTournamentListQuery,
} from "../../../store/api/service/tournament";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { useStatusMessage } from "../../../_poke/context/StatusMessage";
import { getRTKErrorMessage } from "../../../_poke/utils/function";
import {
   registrationSchema,
   STEP_FIELDS,
   TOURNAMENT_ROUTE,
   type IRegistrationContext,
   type IRegistrationForm,
} from "../core/_models";
import { StepTournament } from "./steps/StepTournament";
import { StepTeam } from "./steps/StepTeam";
import { StepConfirm } from "./steps/StepConfirm";

const STEP_LABELS = ["Torneo", "Equipo", "Confirmar"];

/** 3 pasos → mapa de vistas, no ternarios anidados. */
const steps: ReactNode[] = [<StepTournament />, <StepTeam />, <StepConfirm />];

/**
 * Wizard: UN solo form para todos los pasos (el componente sigue montado entre pasos,
 * por eso acá `resetField` sí es legítimo). Cada paso valida solo sus campos con `trigger`.
 */
export const TournamentWizard = () => {
   const navigate = useNavigate();
   const { success } = useStatusMessage();
   const [step, setStep] = useState(0);
   const { data: team = [] } = usePokemonAllQuery();
   const { data: tournaments = [] } = useTournamentListQuery();
   const [createRegistration, createRegistrationStatus] = useCreateRegistrationMutation();

   const methods = useForm<IRegistrationForm, IRegistrationContext>({
      resolver: yupResolver(registrationSchema),
      // datos externos al form que el schema necesita (niveles del equipo y tope del torneo)
      context: { team, tournaments },
      defaultValues: { tournamentId: "", category: "open", pokemonIds: [] },
   });
   const isLastStep = step === steps.length - 1;

   const onNext = async () => {
      const isStepValid = await methods.trigger(STEP_FIELDS[step]);
      if (!isStepValid) return;
      setStep(step + 1);
   };

   const onBack = () => {
      createRegistrationStatus.reset(); // limpia el error de la mutation (no el form)
      setStep(step - 1);
   };

   const onSubmit = async (values: IRegistrationForm) => {
      const selectedTournament = tournaments.find((item) => String(item.id) === values.tournamentId);
      if (!selectedTournament) return;

      const result = await createRegistration({
         tournamentId: selectedTournament.id,
         tournamentName: selectedTournament.name,
         category: values.category,
         pokemonIds: values.pokemonIds,
         nicknames: team.filter((pokemon) => values.pokemonIds.includes(pokemon.id)).map((pokemon) => pokemon.nickname),
         createdAt: new Date().toISOString(),
      });

      // sin unwrap() la mutation no lanza: el error ya lo muestra createRegistrationStatus
      if (!result.data) return;

      success(`Quedaste inscripto en ${selectedTournament.name}.`, { title: "¡Inscripción lista!" });
      navigate(TOURNAMENT_ROUTE);
   };

   return (
      <>
         <PageHeader title="Inscripción a torneo" subtitle="Tres pasos y estás adentro" />
         <Paper elevation={0} sx={{ p: { xs: "1.25rem", md: "2rem" }, borderRadius: "1.25rem" }}>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: "2rem" }}>
               {STEP_LABELS.map((label) => (
                  <Step key={label}>
                     <StepLabel>{label}</StepLabel>
                  </Step>
               ))}
            </Stepper>

            <FormProvider {...methods}>
               <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                  {steps[step]}

                  {createRegistrationStatus.isError && (
                     <ErrorAlert
                        text={getRTKErrorMessage(createRegistrationStatus.error)}
                        close={createRegistrationStatus.reset}
                     />
                  )}

                  <Box display="flex" justifyContent="space-between" gap={1} mt="2rem">
                     <Button
                        type="button"
                        variant="text"
                        sx={{ color: "text.secondary" }}
                        onClick={step === 0 ? () => navigate(TOURNAMENT_ROUTE) : onBack}
                     >
                        {step === 0 ? "Cancelar" : "Atrás"}
                     </Button>
                     {/* `key` distinta: si React reusara el mismo <button> y le cambiara el type a
                         submit en pleno click, el "Siguiente" del penúltimo paso enviaría el form */}
                     {isLastStep ? (
                        <Button key="submit" type="submit" variant="contained" loading={createRegistrationStatus.isLoading}>
                           Inscribirme
                        </Button>
                     ) : (
                        <Button key="next" type="button" variant="contained" onClick={onNext}>
                           Siguiente
                        </Button>
                     )}
                  </Box>
               </Box>
            </FormProvider>
         </Paper>
      </>
   );
};
