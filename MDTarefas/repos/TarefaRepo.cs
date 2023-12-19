using MDTarefas.dataSchemas;
using MDTarefas.mappers;
using MDTarefas.Models;
using MDTarefas.Models.tarefa;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MDTarefas.repo;

public class TarefaRepo
{
    private readonly IMongoCollection<TarefaSchema> _tarefaCollection;

    public TarefaRepo(
        IOptions<TarefaDatabaseSettings> tarefaDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            tarefaDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            tarefaDatabaseSettings.Value.DatabaseName);

        _tarefaCollection = mongoDatabase.GetCollection<TarefaSchema>(
            tarefaDatabaseSettings.Value.TarefaCollectionName);
    }

    public async Task<List<Tarefa>> GetAsync() {
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(_ => true).ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList) {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

    public async Task<Tarefa?> GetAsync(string id){
        TarefaSchema schema = await _tarefaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        return TarefaMapper.toDomain(schema);
    }

    public async Task CreateAsync(Tarefa newTarefa) {
        await _tarefaCollection.InsertOneAsync(TarefaMapper.toPersistance(newTarefa));
    }

    public async Task UpdateAsync(string id, Tarefa updatedTarefa) =>
        await _tarefaCollection.ReplaceOneAsync(x => x.Id == id, TarefaMapper.toPersistance(updatedTarefa));

    public async Task RemoveAsync(string id) =>
        await _tarefaCollection.DeleteOneAsync(x => x.Id == id);
}