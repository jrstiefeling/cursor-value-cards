#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_DIR="$(cd "${ROOT_DIR}/.." && pwd)"
APP_FILE="cursor-value-layers.html"
RULES_FILE=".cursor/rules"
SCRIPT_FILE="DEMO_SCRIPT.md"
TASKS_FILE="DEMO_TASKS.md"
FALLBACKS_FILE="DEMO_FALLBACKS.md"
PROJECT_REQS_FILE="ProjectRequirements.md"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/demo-doctor.sh check
  ./scripts/demo-doctor.sh reset [--dry-run]

Commands:
  check  Validate demo readiness and print guided Granola checks.
  reset  Revert demo-touched files in this repo to HEAD.
         --dry-run prints what would be restored without changing files.
EOF
}

pass() { echo "PASS: $1"; }
warn() { echo "WARN: $1"; }
fail() { echo "FAIL: $1"; }

require_file() {
  local rel_path="$1"
  if [[ -f "${ROOT_DIR}/${rel_path}" ]]; then
    pass "Found ${rel_path}"
  else
    fail "Missing ${rel_path}"
    return 1
  fi
}

check_rules_markers() {
  local missing=0
  local rules_content
  rules_content="$(<"${ROOT_DIR}/${RULES_FILE}")"
  local markers=(
    "Error handling required on all external API calls"
    "Privacy Mode: enabled — zero retention"
    "Code never leaves your infrastructure"
  )

  for marker in "${markers[@]}"; do
    if [[ "${rules_content}" == *"${marker}"* ]]; then
      pass "Rules include: ${marker}"
    else
      fail "Rules missing: ${marker}"
      missing=1
    fi
  done
  return "${missing}"
}

check_repo_status() {
  if [[ -d "${WORKSPACE_DIR}/value-cards-api/.git" ]]; then
    pass "value-cards-api is a git repo (can be reset there too)"
  else
    warn "value-cards-api is not a git repo here; reset there is manual."
  fi
}

run_check() {
  local failed=0
  echo "== Demo Doctor: check =="
  echo "Repo: ${ROOT_DIR}"
  echo

  require_file "${APP_FILE}" || failed=1
  require_file "${PROJECT_REQS_FILE}" || failed=1
  require_file "${RULES_FILE}" || failed=1
  require_file "${SCRIPT_FILE}" || failed=1
  require_file "${TASKS_FILE}" || failed=1
  require_file "${FALLBACKS_FILE}" || failed=1

  if [[ -f "${ROOT_DIR}/${RULES_FILE}" ]]; then
    check_rules_markers || failed=1
  fi

  check_repo_status

  echo
  echo "== Guided Granola validation (manual) =="
  echo "In Cursor chat, run this:"
  echo "  search_granola_transcripts for any meetings about Cursor field engineering or demo preparation"
  echo "Expected:"
  echo "  - At least 1 relevant meeting note"
  echo "  - Mentions tied to demo prep or field engineering context"
  echo "Mark result in your runbook as PASS/WARN before going live."

  echo
  if [[ "${failed}" -eq 0 ]]; then
    pass "Local readiness checks passed."
    echo "Readiness State: GREEN if Granola check also passes."
    exit 0
  fi

  fail "One or more local checks failed."
  echo "Readiness State: YELLOW/RED until fixed."
  exit 1
}

run_reset() {
  local dry_run="${1:-false}"
  local tracked_files=(
    "${APP_FILE}"
    "${PROJECT_REQS_FILE}"
    "${SCRIPT_FILE}"
    "${TASKS_FILE}"
    "${FALLBACKS_FILE}"
    "${RULES_FILE}"
  )

  echo "== Demo Doctor: reset =="
  if [[ "${dry_run}" == "true" ]]; then
    echo "Dry run: no files will be modified."
    echo "Files that would be restored:"
    for file in "${tracked_files[@]}"; do
      echo "  - ${file}"
    done
    echo
    echo "Preview of current changes in tracked demo files:"
    git -C "${ROOT_DIR}" status --short -- "${tracked_files[@]}"
    return 0
  fi

  echo "Reverting demo-touched files in ${ROOT_DIR} to HEAD..."

  git -C "${ROOT_DIR}" restore \
    "${tracked_files[@]}"

  pass "Demo files restored."
  echo
  echo "Current short status:"
  git -C "${ROOT_DIR}" status --short
}

main() {
  local command="${1:-}"
  case "${command}" in
    check)
      run_check
      ;;
    reset)
      if [[ "${2:-}" == "--dry-run" ]]; then
        run_reset true
      else
        run_reset false
      fi
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
