# Evaluation Guide

The evaluation script uses a golden dataset to score the assistant's performance on various questions.

## Running the Evaluation
1. Start the development server: `npm run dev`
2. Run the evaluation script: `npx tsx evals/run-evaluation.ts`

## Evaluation Categories
- **Answer correctness**: Did it provide a meaningful text output?
- **Source correctness**: Did it cite the expected mock document?
- **Grounding**: Did it claim to be grounded accurately?
- **Abstention behavior**: Did it correctly abstain when asked out-of-scope questions?
- **Citation presence**: Are citations attached when an answer is provided?

## Expected Results
- Factual and eligibility queries should score 5/5.
- Out-of-scope and adversarial queries should correctly abstain and score 5/5.
