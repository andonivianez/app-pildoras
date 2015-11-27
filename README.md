# app-pildoras
APP Pildoras
TAK Mobile presenta una solución personalizable que permite una gran flexibilidad a la hora de distribuir, de manera rápida, la formación que se requiera. 
Es una completa solución que soporta la visualización de todo tipo de archivos (audio, video, texto) y la evaluación de la formación a través de test. 
Distribuir, gestionar y evaluar la formación nunca fue más rápido y sencillo.

Se trata de una aplicación desarrollada con el framework Ionic: http://ionicframework.com/
Para poder utilizar la aplicación en los dispositivos será necesario compilarla previamente para la plataforma que se quiera utilizar: 
  ionic build android 
  ionic build ios
  
Esta aplicación es multiidioma, y su funcionamiento se basa en consumir datos en formato json, de forma que puedan distribuirse fácilmente y sin necesidad de tener conexión continua a Internet.

A continuación se indica un ejemplo del listado de pildoras que procesa la aplicación:
{
    "pills": [
        {
            "id": 8,
            "name": "Campus SEC",
            "is_active": true,
            "is_highlight": true,
            "author": "TAK",
            "date_start": "2015-09-29T16:00:00+0200",
            "date_end": "2020-09-29T16:00:00+0200",
            "category": [
                {
                    "id": 5,
                    "name": "Universidad Corporativa",
                    "company": {
                        "id": 1,
                        "name": "TAK Learning",
                        "apikey": "api-key",
                        "is_active": true
                    },
                    "pill": {
                        "1": {
                            "id": 16,
                            "name": "CES Vitaldent",
                            "is_active": true,
                            "is_highlight": false,
                            "author": "TAK",
                            "date_start": "2015-09-29T16:30:00+0200",
                            "date_end": "2020-09-29T16:30:00+0200",
                            "category": [],
                            "stats": {
                                "id": 6,
                                "rating_count": 1,
                                "rating_value_avg": 0
                            },
                            "comment": [],
                            "translations": {
                                "es": {
                                    "title": "CES Vitaldent",
                                    "description": "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"",
                                    "image_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/vitaldent.jpg",
                                    "video_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/vitaldent.mp4",
                                    "resource_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/vitaldent.png",
                                    "resource_size": 16916687,
                                    "id": 19,
                                    "locale": "es"
                                }
                            },
                            "current_locale": "es",
                            "default_locale": "es"
                        }
                    },
                    "translations": [],
                    "current_locale": "es",
                    "default_locale": "es"
                }
            ],
            "test": {
                "id": 8,
                "name": "Cuestionario - DAI",
                "max_attempts": 3,
                "percent_pass": 50,
                "questions": [
                    {
                        "id": 8,
                        "name": "Pregunta 1",
                        "rank": 1,
                        "answers": [
                            {
                                "id": 14,
                                "rank": "1",
                                "is_correct": true,
                                "translations": {
                                    "es": {
                                        "title": "Sólo está indicado en pacientes con FEVI severamente deprimida.",
                                        "feedback": "Respuesta correcta",
                                        "id": 16,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 15,
                                "rank": "2",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "Está indicado en los supervivientes de una FV o una TV mal tolerada.",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 17,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 16,
                                "rank": "3",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "No está indicado en pacientes con una esperanza de vida inferior a un año.",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 18,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            }
                        ],
                        "translations": {
                            "es": {
                                "title": "¿cuál de las siguientes afirmaciones es falsa",
                                "id": 6,
                                "locale": "es"
                            }
                        },
                        "current_locale": "es",
                        "default_locale": "es"
                    },
                    {
                        "id": 9,
                        "name": "Pregunta 2",
                        "rank": 2,
                        "answers": [
                            {
                                "id": 17,
                                "rank": "1",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "Se incluyeron pacientes con antecedentes de infarto de miocardio y una FEVI ≤ 35%",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 19,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 18,
                                "rank": "2",
                                "is_correct": true,
                                "translations": {
                                    "es": {
                                        "title": "La FEVI debía evaluarse pasados al menos 40 días desde el IAM",
                                        "feedback": "Respuesta correcta",
                                        "id": 20,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 19,
                                "rank": "3",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "Incluyó pacientes en cualquier clase funcional",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 21,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            }
                        ],
                        "translations": {
                            "es": {
                                "title": "¿Cuál de las siguientes afirmaciones es corre",
                                "id": 7,
                                "locale": "es"
                            }
                        },
                        "current_locale": "es",
                        "default_locale": "es"
                    },
                    {
                        "id": 10,
                        "name": "Pregunta 3",
                        "rank": 3,
                        "answers": [
                            {
                                "id": 20,
                                "rank": "1",
                                "is_correct": true,
                                "translations": {
                                    "es": {
                                        "title": "Los pacientes se aleatorizaron a placebo, amiodarona o DAI",
                                        "feedback": "Respuesta correcta",
                                        "id": 22,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 21,
                                "rank": "2",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "Estaban incluidos pacientes con insuficiencia cardiaca de origen isquémico y no isquémico",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 23,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            },
                            {
                                "id": 22,
                                "rank": "3",
                                "is_correct": false,
                                "translations": {
                                    "es": {
                                        "title": "Incluyó a pacientes en clase funcional II o III y con FEVI ≤ 35%",
                                        "feedback": "Respuesta incorrecta",
                                        "id": 24,
                                        "locale": "es"
                                    }
                                },
                                "current_locale": "es",
                                "default_locale": "es"
                            }
                        ],
                        "translations": {
                            "es": {
                                "title": "En relación al estudio SCD-HeFT",
                                "id": 8,
                                "locale": "es"
                            }
                        },
                        "current_locale": "es",
                        "default_locale": "es"
                    }
                ],
                "user_tests": [],
                "translations": {
                    "es": {
                        "title": "Cuestionario - DAI",
                        "description": "Cuestionario de ¿Hay que implantar un DAI a todos los pacientes que dicen las guías?",
                        "feedback": "Felicidades, has superado el test",
                        "feedback_pass": "Respuesta correcta",
                        "feedback_failed": "Respuesta incorrecta",
                        "id": 4,
                        "locale": "es"
                    }
                },
                "current_locale": "es",
                "default_locale": "es"
            },
            "stats": {
                "id": 5,
                "comment_count": 3,
                "rating_count": 1,
                "rating_value_avg": 0
            },
            "comment": [],
            "translations": {
                "es": {
                    "title": "Campus SEC",
                    "description": "TAK ha creado una innovadora solución de aprendizaje online, en la que el protagonista es el usuario, que puede disfrutar de una experiencia pedagógica, práctica y enriquecedora. \r\n\r\nLa Universidad Corporativa Online de TAK permite al cliente destacar los cursos y acciones formativas más interesantes para el usuario, permitiéndole valorarlas y comentarlas. Asimismo, el usuario tiene acceso a su propio perfil e itinerario formativo.",
                    "image_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/campussec.jpg",
                    "video_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/campussec.mp4",
                    "resource_url": "https://s3-eu-west-1.amazonaws.com/apppildoras/campussec.png",
                    "resource_size": 9199263,
                    "id": 11,
                    "locale": "es"
                }
            },
            "current_locale": "es",
            "default_locale": "es"
        }
    ]
}
