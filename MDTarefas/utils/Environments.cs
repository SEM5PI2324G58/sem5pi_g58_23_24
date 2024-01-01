using System.Reflection.Metadata;
using System.Runtime.ConstrainedExecution;

namespace MDTarefas.utils
{
    public static class Environments{
        public const string MDRI_API_URL = "http://localhost:4000/api";

        public const string MDRI_API_PLANEAMENTO_URL = MDRI_API_URL + "/planeamento";  

        public const string  PLANEAMENTO_API_URL = "http://127.0.0.1:8000";
    }
}