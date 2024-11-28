import openai
from typing import List, Dict, TypedDict, Optional, Tuple
from dataclasses import dataclass
import json
import time
import os
import random

class Skill(TypedDict):
    name: str
    level: str

class Experience(TypedDict):
    company: str
    position: str
    duration: str
    description: str

class Education(TypedDict):
    institution: str
    degree: str
    field: str
    graduationYear: str

class Profile(TypedDict):
    fullName: str
    educationLevel: str
    careerStatus: str
    skills: List[Skill]
    experience: List[Experience]
    education: List[Education]
    location: str

class InterviewQuestion(TypedDict):
    field: str
    question: str
    required_fields: List[str]
    validation_rules: Dict[str, str]

def setup_openai_key():
    """Configura la API key de OpenAI de forma segura"""
    # Asegúrate de que la variable de entorno 'OPENAI_API_KEY' esté configurada con tu clave API de OpenAI
    openai.api_key = os.environ.get("OPENAI_API_KEY", "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")
    return openai

INTERVIEWER_PROMPT = """
Eres Kero, un entrevistador de IA especializado en entrevistas laborales. Tu objetivo es obtener información clara y completa para crear un perfil profesional.

Reglas:
1. Realiza preguntas específicas según el campo requerido
2. Si una respuesta es ambigua o incompleta, solicita aclaraciones específicas
3. No avances hasta tener información clara y completa
4. Mantén un tono profesional pero amigable
5. No repitas preguntas si ya tienes la información clara
6. Solo genera una pregunta o aclaración a la vez

Campo actual: {field}
Campos requeridos: {required_fields}
Información actual: {current_info}
Historial de la conversación: {conversation_history}

¿Qué pregunta o aclaración harías a continuación?
"""

INTERVIEWEE_PROMPT = """
Eres un candidato en una entrevista laboral. Debes proporcionar respuestas realistas que pueden ser:
1. Claras y completas (70% de las veces)
2. Ambiguas o incompletas (20% de las veces)
3. Vagas o evasivas (10% de las veces)

Perfil base:
- Profesional de tecnología
- 2-5 años de experiencia
- Nivel educativo universitario
- Habilidades técnicas y blandas variadas

Pregunta del entrevistador: {question}
Historial de la conversación: {conversation_history}

Proporciona una respuesta realista siguiendo las probabilidades indicadas.
"""

RESPONSE_VALIDATOR_PROMPT = """
Analiza la siguiente respuesta para el campo '{field}' y determina:
1. Si la respuesta es clara y completa
2. Qué información específica falta o es ambigua
3. Si la información proporcionada es válida según las reglas

Respuesta: {response}
Campos requeridos: {required_fields}
Reglas de validación: {validation_rules}

Retorna un JSON con el siguiente formato:
{{
    "is_complete": boolean,
    "is_valid": boolean,
    "missing_fields": [],
    "ambiguous_fields": [],
    "parsed_data": {{}},
    "feedback": "string"
}}
"""

def get_interview_structure() -> List[InterviewQuestion]:
    """Define la estructura completa de la entrevista con reglas de validación"""
    return [
        {
            "field": "fullName",
            "question": "Hola, gracias por estar aquí. Para comenzar, ¿me podrías decir tu nombre completo?",
            "required_fields": ["fullName"],
            "validation_rules": {
                "format": "string",
                "must_contain": "nombre y apellido",
                "pattern": "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$"
            }
        },
        {
            "field": "educationLevel",
            "question": "¿Cuál es tu nivel educativo más alto? Por ejemplo: Primaria, Secundaria, Preparatoria o Universidad.",
            "required_fields": ["educationLevel"],
            "validation_rules": {
                "valid_options": ["Primaria", "Secundaria", "Preparatoria", "Universidad", "Posgrado"],
                "format": "string",
                "required": True
            }
        },
        {
            "field": "careerStatus",
            "question": "¿Cuál es tu situación profesional actual? ¿Estás empleado, buscando trabajo o eres estudiante?",
            "required_fields": ["careerStatus"],
            "validation_rules": {
                "valid_options": ["Empleado", "Desempleado", "Estudiante", "Freelance", "Buscando trabajo"],
                "format": "string",
                "required": True
            }
        },
        {
            "field": "skills",
            "question": "Hablemos ahora de tus habilidades. ¿Qué habilidades destacadas tienes y cómo calificarías tu nivel en cada una? Por ejemplo: 'Liderazgo - Intermedio' o 'Programación - Avanzado'.",
            "required_fields": ["name", "level"],
            "validation_rules": {
                "format": "array",
                "min_items": 1,
                "max_items": 10,
                "item_rules": {
                    "name": {
                        "type": "string"
                    },
                    "level": {
                        "valid_options": ["Básico", "Intermedio", "Avanzado", "Experto"],
                        "type": "string"
                    }
                }
            }
        },
        {
            "field": "experience",
            "question": "¿Puedes contarme sobre tu experiencia laboral? Incluye el nombre de la empresa, tu cargo, la duración y una breve descripción de tus actividades.",
            "required_fields": ["company", "position", "duration", "description"],
            "validation_rules": {
                "format": "array",
                "min_items": 0,
                "max_items": 10,
                "item_rules": {
                    "company": {
                        "type": "string",
                        "required": True
                    },
                    "position": {
                        "type": "string",
                        "required": True
                    },
                    "duration": {
                        "type": "string",
                        "pattern": "^\\d+\\s+(mes(es)?|año(s)?)$",
                        "required": True
                    },
                    "description": {
                        "type": "string",
                        "required": True
                    }
                }
            }
        },
        {
            "field": "education",
            "question": "Sobre tu formación académica, ¿podrías darme más detalles? Como el nombre de la institución, el grado académico, el campo de estudio y el año de graduación.",
            "required_fields": ["institution", "degree", "field", "graduationYear"],
            "validation_rules": {
                "format": "array",
                "min_items": 1,
                "max_items": 5,
                "item_rules": {
                    "institution": {
                        "type": "string",
                        "required": True
                    },
                    "degree": {
                        "type": "string",
                        "required": True,
                        "valid_options": [
                            "Primaria", "Secundaria", "Preparatoria", 
                            "Licenciatura", "Ingeniería", "Maestría", 
                            "Doctorado", "Certificación", "Diplomado"
                        ]
                    },
                    "field": {
                        "type": "string",
                        "required": True
                    },
                    "graduationYear": {
                        "type": "string",
                        "pattern": "^(19|20)\\d{{2}}$|^En curso$",
                        "required": True
                    }
                }
            }
        },
        {
            "field": "location",
            "question": "Por último, ¿en dónde resides actualmente? Por favor, indica ciudad y país.",
            "required_fields": ["location"],
            "validation_rules": {
                "format": "string",
                "must_contain": ["ciudad", "país"],
                "pattern": "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s,]+$"
            }
        }
    ]

def get_clarification_questions(field: str, missing_info: List[str]) -> str:
    """Genera preguntas de aclaración específicas según el campo y la información faltante"""
    clarification_templates = {
        # (Aquí va el diccionario de plantillas de aclaración como en tu código original)
        # Por brevedad, puedes copiar el código original aquí
    }

    default_clarification = "¿Podrías proporcionar más detalles sobre {field}?"

    if field in clarification_templates:
        if not missing_info:
            return clarification_templates[field]["general"]
        # Si hay información específica faltante, primero busca una pregunta específica
        if missing_info[0] in clarification_templates[field]:
            return clarification_templates[field][missing_info[0]]
        # Si no hay pregunta específica, elige una pregunta de clarificación aleatoria
        return random.choice(clarification_templates[field]["clarificacion"])

    return default_clarification.format(field=field)

def validate_response(
    client: openai,
    field: str,
    response: str,
    required_fields: List[str],
    validation_rules: Dict[str, str]
) -> Dict:
    """Valida y analiza la respuesta usando GPT"""
    try:
        completion = client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": RESPONSE_VALIDATOR_PROMPT.format(
                    field=field,
                    response=response,
                    required_fields=required_fields,
                    validation_rules=validation_rules
                )}
            ],
            max_tokens=500,
            temperature=0
        )
        validation_result = json.loads(completion.choices[0].text.strip())

        return validation_result
    except Exception as e:
        print(f"Error en validación: {e}")
        return {
            "is_complete": False,
            "is_valid": False,
            "missing_fields": required_fields,
            "ambiguous_fields": [],
            "parsed_data": {},
            "feedback": "Error en el proceso de validación"
        }

def get_interviewer_response(
    client: openai,
    field: str,
    required_fields: List[str],
    current_info: Dict,
    conversation_history: List[Dict]
) -> str:
    """Genera la siguiente pregunta o aclaración del entrevistador"""
    try:
        # Formatear el historial de la conversación para el prompt
        formatted_history = json.dumps([{
            "role": msg["role"],
            "content": msg["content"]
        } for msg in conversation_history], ensure_ascii=False)

        completion = client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": INTERVIEWER_PROMPT.format(
                    field=field,
                    required_fields=required_fields,
                    current_info=json.dumps(current_info, ensure_ascii=False),
                    conversation_history=formatted_history
                )}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return completion.choices[0].text.strip()
    except Exception as e:
        print(f"Error generando pregunta: {e}")
        return None

def get_interviewee_response(
    client: openai,
    question: str,
    conversation_history: List[Dict]
) -> str:
    """Simula una respuesta del entrevistado"""
    try:
        completion = client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": INTERVIEWEE_PROMPT.format(
                    question=question,
                    conversation_history=formatted_history
                )}
            ],
            max_tokens=150,
            temperature=0.9
        )
        return completion.choices[0].text.strip()
    except Exception as e:
        print(f"Error generando respuesta: {e}")
        return None

def conduct_interview(client: openai) -> Profile:
    """Realiza la entrevista completa manejando respuestas ambiguas"""
    profile_data: Profile = {
        "fullName": "",
        "educationLevel": "",
        "careerStatus": "",
        "skills": [],
        "experience": [],
        "education": [],
        "location": ""
    }

    conversation_history = []
    interview_structure = get_interview_structure()

    print("🤖 Iniciando entrevista...")

    for question_structure in interview_structure:
        field = question_structure["field"]
        question = question_structure["question"]
        required_fields = question_structure["required_fields"]
        validation_rules = question_structure["validation_rules"]
        field_complete = False
        attempts = 0
        max_attempts = 3

        print(f"\n📝 Procesando campo: {field}")

        while not field_complete and attempts < max_attempts:
            # Obtener pregunta del entrevistador
            if attempts == 0:
                interviewer_question = question
            else:
                # Obtener preguntas de aclaración
                missing_info = validation_result.get('missing_fields', [])
                interviewer_question = get_clarification_questions(field, missing_info)

            print(f"Interviewer: {interviewer_question}")
            conversation_history.append({"role": "interviewer", "content": interviewer_question})

            # Obtener respuesta del entrevistado
            interviewee_response = get_interviewee_response(client, interviewer_question, conversation_history)
            print(f"Interviewee: {interviewee_response}")
            conversation_history.append({"role": "interviewee", "content": interviewee_response})

            # Validar la respuesta
            validation_result = validate_response(
                client,
                field,
                interviewee_response,
                required_fields,
                validation_rules
            )

            if validation_result["is_complete"] and validation_result["is_valid"]:
                # Guardar la información en el perfil
                profile_data[field] = validation_result["parsed_data"]
                field_complete = True
                print(f"✅ Información para {field} registrada con éxito.")
            else:
                # Proporcionar feedback al entrevistado (en este caso, simplemente imprimir)
                feedback = validation_result.get("feedback", "Necesitamos más información.")
                print(f"Interviewer: {feedback}")
                conversation_history.append({"role": "interviewer", "content": feedback})
                attempts += 1

        if not field_complete:
            print(f"⚠️ No se pudo obtener información completa para {field} después de {max_attempts} intentos.")

    print("\n📄 Perfil profesional completado:")
    print(json.dumps(profile_data, indent=4, ensure_ascii=False))

    return profile_data

if __name__ == "__main__":
    client = setup_openai_key()
    conduct_interview(client)
